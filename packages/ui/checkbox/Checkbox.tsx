import type { InputHTMLAttributes, JSX } from 'react'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  set?: (value: boolean) => void
}

function Checkbox({
  set,
  className = '',
  checked,
  ...rest
}: CheckboxProps): JSX.Element {
  return (
    <div className="relative flex items-center justify-center">
      <input
        checked={checked}
        className={`border border-slate-700 checked:bg-gradient-to-r checked:border-[3px] checked:from-blue checked:to-pink cursor-pointer appearance-none h-5 w-5 rounded-[4px] bg-slate-900 disabled:bg-slate-900 disabled:border-slate-800 ${className}`}
        onChange={event => (set ? set(event.target.checked) : null)}
        type="checkbox"
        {...rest}
      />
    </div>
  )
}

export default Checkbox
