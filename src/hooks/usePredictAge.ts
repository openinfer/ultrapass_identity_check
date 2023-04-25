import { useState } from "react";
import { predictAge } from "@privateid/cryptonets-web-sdk";

const usePredictAge = () => {
  const [age, setAge] = useState(null);
  const [predictAgeHasFinished, setPredictAgeHasFinished] = useState(false);

  const predictAgeCallback = (response?: any) => {
    // console.log("RESPONSE USEPREDICT FE: ", response);

    const { faces } = response?.returnValue || {};

    if (faces.length === 0) {
      setAge(null);
      setPredictAgeHasFinished(true);
    } else {
      for (let index = 0; faces.length > index; index++) {
        const { status, age } = faces[index];

        if (age > 0) {
          setAge(age);
          setPredictAgeHasFinished(true);
          index = faces.length;
        }

        if (index + 1 === faces.length && age <= 0) {
          setAge(null);
          setPredictAgeHasFinished(true);
        }
      }
    }
  };

  const doPredictAge = async () => {
    await predictAge(undefined, predictAgeCallback);
    // console.log(
    //   229,
    //   `${(performance as any).memory.usedJSHeapSize / Math.pow(1000, 2)} MB`
    // );
    // console.log("IMAGE DATA HERE??????????", data ? data : false);
  };

  return { doPredictAge, age, predictAgeHasFinished, setPredictAgeHasFinished };
};

export default usePredictAge;
