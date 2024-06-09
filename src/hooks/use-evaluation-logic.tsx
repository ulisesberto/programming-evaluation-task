import { useState } from "react";

export function useEvaluationLogic() {
  const { replaceTwoLettersAt } = useToolsFunctions();

  const replacements: { [key: string]: string } = {
    AE: "Ä%",
    OE: "Ö%",
    UE: "Ü%",
    SS: "ß%",
  };

  const replacementsBasic: { [key: string]: string } = {
    AE: "Ä",
    OE: "Ö",
    UE: "Ü",
    SS: "ß",
  };

  function replaceAll(name: string): string {
    return name.replace(/AE|OE|UE|SS/g, (match) => replacementsBasic[match]);
  }

  function replaceAllNames(names: string[]) {
    return names.map(replaceAll);
  }

  function searchIndexPosibilitiesByKey(key: string, word: string) {
    let indexToReplace: number[] = [];
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] + word[i + 1] == key) {
        indexToReplace.push(i);
      }
    }
    return indexToReplace;
  }

  function indexCombinations(nums: number[]): number[][] {
    const result: number[][] = [[]];

    for (const num of nums) {
      const currentLength = result.length;
      for (let i = 0; i < currentLength; i++) {
        const currentCombination = result[i];
        result.push([...currentCombination, num]);
      }
    }

    return result;
  }

  function GetAllIndexToReplace(word: string) {
    const combinedReplaces: number[] = [];
    for (const key in replacements) {
      const indices = searchIndexPosibilitiesByKey(key, word);
      combinedReplaces.push(...indices);
    }
    return combinedReplaces;
  }

  function getAllVariationsPerWord(word: string) {
    let wordsWithReplace: string[] = [];
    const replacementIndex = GetAllIndexToReplace(word);
    const allWordReplaceCombinations = indexCombinations(replacementIndex);
    allWordReplaceCombinations.forEach((arrayIndex) => {
      let wordToReplace = word;
      arrayIndex.forEach((index) => {
        const key = wordToReplace[index] + wordToReplace[index + 1];
        if (replacements[key]) {
          wordToReplace = replaceTwoLettersAt(
            wordToReplace,
            index,
            replacements[key]
          );
        }
      });
      const wordClean = wordToReplace.replace(/%/g, "");
      wordsWithReplace.push(wordClean);
    });
    return wordsWithReplace;
  }

  function generateSQLStatements(variations: string[]) {
    const baseQuery = "SELECT * FROM tbl_phonebook WHERE last_name IN (";
    const formattedNames = variations.map((name) => `'${name}'`).join(", ");
    return `${baseQuery}${formattedNames});`;
  }

  return {
    generateSQLStatements,
    replaceAllNames,
    getAllVariationsPerWord,
  };
}

export function useToolsFunctions() {
  function replaceTwoLettersAt(
    word: string,
    index: number,
    replacement: string
  ): string {
    const before = word.substring(0, index);
    const after = word.substring(index + 2);
    return before + replacement + after;
  }
  return {
    replaceTwoLettersAt,
  };
}
