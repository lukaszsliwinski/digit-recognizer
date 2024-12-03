function Header({ text } : { text: string }) {
  return (
    <h2  className="text-2xl font-semibold text-center">{text}</h2>
  )
}

export default Header;