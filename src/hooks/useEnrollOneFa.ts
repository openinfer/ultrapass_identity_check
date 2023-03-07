import { useState } from "react";
import { enroll1FA } from "@privateid/cryptonets-web-sdk-alpha";

const useEnrollOneFa = (
  element = "userVideo",
  onSuccess = (e: string) => {},
  retryTimes = 4
) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [enrollData, setEnrollData] = useState(null);

  let tries = 0;

  const enrollUserOneFa = async () => {
    setFaceDetected(false);
    setEnrollStatus("");
    setProgress(0);
    setEnrollData(null);
    // eslint-disable-next-line no-unused-vars
    await enroll1FA(callback, {
      input_image_format: "rgba",
    } as any);
  };

  function wait(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  const getDisplayedMessage = (result: number) => {
    switch (result) {
      case -1:
        return "Please look at the camera";
      case 0:
        return "Face detected";
      case 1:
        return "Image Spoof";
      case 2:
        return "Video Spoof";
      case 3:
        return "Video Spoof";
      case 4:
        return "Too far away";
      case 5:
        return "Too far to right";
      case 6:
        return "Too far to left";
      case 7:
        return "Too far up";
      case 8:
        return "Too far down";
      case 9:
        return "Too blurry";
      case 10:
        return "PLEASE REMOVE EYEGLASSES";
      case 11:
        return "PLEASE REMOVE FACEMASK";
      default:
        return "";
    }
  };

  const callback = async (result: any) => {
    console.log("enroll callback hook result:", result);
    switch (result.status) {
      case "VALID_FACE":
        setFaceDetected(true);
        setEnrollStatus("");
        setProgress(result.progress);
        break;
      case "INVALID_FACE":
        if (enrollStatus && enrollStatus?.length > 0) {
          wait(500);
          setEnrollStatus(
            result?.message || getDisplayedMessage(result.result)
          );
        } else {
          setEnrollStatus(
            result?.message || getDisplayedMessage(result.result)
          );
        }
        setFaceDetected(false);
        break;
      case "ENROLLING":
        setEnrollStatus("Verifying");
        setFaceDetected(true);
        break;
      case "WASM_RESPONSE":
        if(result.returnValue?.error === -1 || result.returnValue?.error === -100 || result.returnValue?.status === -1 || result.returnValue?.status === -100) {
          setEnrollStatus("ENROLL FAILED, PLEASE TRY AGAIN");
          enrollUserOneFa();
          return
        }
        if (result.returnValue?.status === 0) {
          setEnrollStatus("Verify Success");
          setEnrollData(result.returnValue);
          onSuccess(result?.returnValue);
        }
        // if (result.returnValue?.status === -1) {
        //   if (tries === retryTimes) {
        //     // onFailure();
        //   } else {
        //     tries += 1;
        //     // enrollUserOneFa();
        //   }
        // }
        break;
      default:
    }
  };

  return { faceDetected, enrollStatus, enrollData, enrollUserOneFa, progress };
};

export default useEnrollOneFa;
