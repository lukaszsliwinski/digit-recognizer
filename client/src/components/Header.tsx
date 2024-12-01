function Header({ text } : { text: string }) {
  return (
    <h2  className="text-2xl font-semibold text-center mb-2">{text}</h2>
  )
}

export default Header;