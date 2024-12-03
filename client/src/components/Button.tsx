interface IButton {
  type: "submit" | "reset" | "button" | undefined,
  click: React.MouseEventHandler<HTMLButtonElement> | undefined,
  disabled: boolean | undefined,
  text: string
}

function Button({ type, click, disabled, text }: IButton) {
  return (
    <button
      className="w-32 h-12 m-2 text-sm rounded-xl enabled:shadow-lg bg-indigo-700 font-semibold text-white enabled:hover:cursor-pointer enabled:hover:shadow-none disabled:opacity-50"
      type={type}
      onClick={click}
      disabled={disabled}
    >{text}</button>
  )
}

export default Button;