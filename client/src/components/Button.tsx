interface IButton {
  type: "submit" | "reset" | "button" | undefined,
  click: React.MouseEventHandler<HTMLButtonElement> | undefined,
  disabled: boolean | undefined,
  text: string
}

function Button({ type, click, disabled, text }: IButton) {
  return (
    <button
      className="w-24 h-8 m-2 bg-slate-700 text-white enabled:hover:cursor-pointer enabled:hover:bg-slate-500 disabled:opacity-75"
      type={type}
      onClick={click}
      disabled={disabled}
    >{text}</button>
  )
}

export default Button;