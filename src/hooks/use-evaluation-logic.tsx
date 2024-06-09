import { useState } from "react";

export function useEvaluationLogic() {
  const { replaceTwoLettersAt } = useToolsFunctions();

  //the "%" is bacause if we delete two letters and put 1 letter in that place the lenght of the string will be shorter,
  // and if we need to make multiple replaces the indices info will be useless, is necesary more logic, isn´t practical right ?
  //better if we replace and mantains the lenght of the string and we delete the % leter
  const replacements: { [key: string]: string } = {
    AE: "Ä%",
    OE: "Ö%",
    UE: "Ü%",
    SS: "ß%",
  };

  //this one is only to the step 1 task
  const replacementsBasic: { [key: string]: string } = {
    AE: "Ä",
    OE: "Ö",
    UE: "Ü",
    SS: "ß",
  };
  //If we only need to replace all in step 1, we can use a regex and the task is complete. There's no need for unnecessary code to achieve this
  function replaceAll(name: string): string {
    return name.replace(/AE|OE|UE|SS/g, (match) => replacementsBasic[match]);
  }

  //replace all of a names list
  function replaceAllNames(names: string[]) {
    return names.map(replaceAll);
  }

  //this is the heart of the program, takes the indices array and makes a matrix with all posible variations,
  // can be maked with a recursive function but is not easy to understand what is going on there, so I prefer this solution easier
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

  //this looks the word and takes the index of all positions that can be replaced, with the keys options, for each one
  //we call to searchIndexPosibilitiesByKey and get the index posible replaces off all key
  function GetAllIndexToReplace(word: string) {
    const combinedReplaces: number[] = [];
    for (const key in replacements) {
      const indices = searchIndexPosibilitiesByKey(key, word);
      combinedReplaces.push(...indices);
    }
    return combinedReplaces;
  }
  //this search the variations but for only 1 key for example: AE, this could be in the GetAllIndexToReplace
  // but for me the code is more simple if this is a separated function
  function searchIndexPosibilitiesByKey(key: string, word: string) {
    let indexToReplace: number[] = [];
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] + word[i + 1] == key) {
        indexToReplace.push(i);
      }
    }
    return indexToReplace;
  }

  //finally the function that join all other functions to get the final result
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

  //this need to be in the backend but is here for practical, we don´t have a backend here
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
  //this is to replace the characters easy, split the word in before and after,
  //delete the characters to be replaced and put the new one in the middle
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
