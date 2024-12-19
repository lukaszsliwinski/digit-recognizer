// Props
interface IButton {
  type: 'submit' | 'reset' | 'button' | undefined;
  click: React.MouseEventHandler<HTMLButtonElement> | undefined;
  disabled: boolean | undefined;
  text: string;
}

function Button({ type, click, disabled, text }: IButton) {
  return (
    <button
      className="m-2 h-12 w-32 rounded-xl bg-cyan-800 text-sm font-semibold text-neutral-50 transition-all enabled:shadow-lg enabled:hover:cursor-pointer enabled:hover:opacity-95 enabled:hover:shadow-none disabled:opacity-50"
      type={type}
      onClick={click}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
