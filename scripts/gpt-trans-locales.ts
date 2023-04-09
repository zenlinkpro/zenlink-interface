import { promises as fsp } from 'node:fs'
import { ChatGPTAPI } from 'chatgpt'
import proxy from 'https-proxy-agent'
import nodeFetch from 'node-fetch'
import { oraPromise } from 'ora'

const locales = [
  'af-ZA',
  'fr-FR',
  'ja-JP',
  'ko-KR',
  'ru-RU',
  'zh-CN',
  'zh-TW',
]

const BATCH_SIZE = 15

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function transAllLocalesFromGPT() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey)
    throw new Error('You need provide your openai api key')

  const proxyUrl = process.env.PROXY_URL
  const proxyPort = process.env.PROXY_PORT

  const api = new ChatGPTAPI({
    apiKey,
    debug: false,
    // @ts-expect-error nocheck
    fetch: proxyUrl && proxyPort
      ? (url, options = {}) => {
          const defaultOptions = {
            agent: proxy(`${proxyUrl}:${proxyPort}`),
          }

          // @ts-expect-error nocheck
          return nodeFetch(url, { ...defaultOptions, ...options })
        }
      : undefined,
  })

  for await (const locale of locales) {
    const contents = await fsp.readFile(`./packages/locales/${locale}.po`, 'utf8')
    const header = contents.match(/msgid ""\nmsgstr ""\n[\s\S]+?(?=\n\n)/)![0]
    const entries = contents.match(/^#: .+\nmsgid ".+"\nmsgstr ".*"/gm)!
    let translatedContent = ''

    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE)
      const untranslatedBatch = batch.filter(entry => entry.match(/msgstr ""/))
      const msgids = untranslatedBatch.map(entry => entry.match(/msgid "(.+)"/)?.[1]).filter(Boolean)

      if (msgids.length === 0) {
        translatedContent += `${batch.join('\n\n')}\n\n`
        continue
      }

      const prompt = `
        Translate the following English texts to ${locale}, Pay attention to the translation format, and make sure it corresponds with the punctuation in the original text:\n${
          msgids.map((msgid, index) => `${index + 1}. ${msgid}`).join('\n')
        }
      `

      const res = await oraPromise(api.sendMessage(prompt), {
        text:
          `Translating ${locale} ${i} -> ${
            i + BATCH_SIZE > entries.length ? entries.length : i + BATCH_SIZE
          } of total ${entries.length}`,
      })

      const translations = res.text.split('\n').map(line => line.replace(/^\d+\. /, ''))

      let translatedIndex = 0
      for (let j = 0; j < batch.length; j++) {
        const entry = batch[j]
        if (entry.match(/msgstr "(\s*)"/)) {
          const translation = translations[translatedIndex].replace(/([.?!])\s*$/, '')
          translatedContent += `${entry.replace(/msgstr "(\s*)"/, `msgstr "${translation}"`)}\n\n`
          translatedIndex++
        }
        else {
          translatedContent += `${entry}\n\n`
        }
      }

      await delay(1000)
    }

    await fsp.writeFile(
      `./packages/locales/${locale}.po`,
      `${header}\n\n${translatedContent}`,
    )
  }
}

transAllLocalesFromGPT()
