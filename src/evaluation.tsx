import { useState } from "react";
import { useEvaluationLogic } from "./hooks/use-evaluation-logic";

export function Evaluation() {
  const exampleNames = [
    "KOESTNER",
    "RUESSWURM",
    "DUERMUELLER",
    "JAEAESKELAEINEN",
    "GROSSSCHAEDL",
  ];

  const { getAllVariationsPerWord, replaceAllNames, generateSQLStatements } =
    useEvaluationLogic();
  const [convertedNamesStep1, setConvertedNamesStep1] = useState<string[]>([]);
  const [allPosibilitiesWord, setAllPosibilitiesWord] = useState<string[]>([]);
  const [sqlStatlement, setSqlStatlement] = useState<string>();

  function handleOnClickStep1() {
    setConvertedNamesStep1(replaceAllNames(exampleNames));
  }

  function handleOnchangeStep3(word: string) {
    const posibilities = getAllVariationsPerWord(word);
    setSqlStatlement(generateSQLStatements(posibilities));
  }

  function handleOnchange(word: string) {
    const posibilities = getAllVariationsPerWord(word);
    setAllPosibilitiesWord(posibilities);
  }

  function handleCopyClick() {
    if (sqlStatlement)
      navigator.clipboard
        .writeText(sqlStatlement)

        .catch((error) => console.error("Error in copy: ", error));
  }

  return (
    <>
      <div className="container">
        <h1>Step 1: Replace all</h1>
        <h2>Some examples:</h2>
        <div className="names">{exampleNames.join(" , ")}</div>
        <button onClick={handleOnClickStep1}>replace all (Step 1)</button>
        {convertedNamesStep1.length !== 0 && (
          <div className="converted-names">
            {convertedNamesStep1.join(", ")}
          </div>
        )}
      </div>

      <div className="container">
        <h1>Step 2: Generate possible variations</h1>
        <input
          type="text"
          className="input"
          onChange={(v) =>
            handleOnchange(v.target.value.toString().toUpperCase())
          }
          placeholder="Write a word to generate variations"
        />
        {allPosibilitiesWord.length !== 0 && (
          <div className="converted-names">
            {allPosibilitiesWord.join(", ")}
          </div>
        )}
      </div>

      <div className="container">
        <h1>Step 3: SQL statement</h1>
        <input
          type="text"
          className="input"
          onChange={(v) =>
            handleOnchangeStep3(v.target.value.toString().toUpperCase())
          }
          placeholder="Write a word to generate a SQL statement"
        />
        <button onClick={handleCopyClick}>Copy</button>

        {sqlStatlement !== "" && (
          <div className="converted-names">{sqlStatlement}</div>
        )}
      </div>
    </>
  );
}

export default Evaluation;
