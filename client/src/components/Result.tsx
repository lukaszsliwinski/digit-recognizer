function Result({ result } : { result: string | undefined }) {
  return (
    <div className="font-semibold w-40 mx-auto">recognized digit: {result}</div>
  )
}

export default Result;