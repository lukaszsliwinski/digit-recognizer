interface IResult {
  result: string | undefined,
  confidence: string | undefined
}

function Result({ result, confidence } : IResult) {
  return (
    <div className="font-semibold w-40 mx-auto">
      recognized digit: {result}
      <br />
      confidence: {confidence}
    </div>
  )
}

export default Result;