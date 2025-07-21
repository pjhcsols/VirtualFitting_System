import { useState } from "react";
import { termsOfUse } from "../constants";

function useTermsOfUse() {
  const [basiliumTermsOfUse, setBasiliumTermsOfUse] = useState({
    title: termsOfUse.basiliumTermsOfUse.title,
    content: termsOfUse.basiliumTermsOfUse.content,
    isAccepted: false,
    isDeclined: false,
  });
  const [privatePolicy, setPrivatePolicy] = useState({
    title: termsOfUse.privatePolicy.title,
    content: termsOfUse.privatePolicy.content,
    isAccepted: false,
    isDeclined: false,
  });

  const onClickBasiliumTermsOfUse = (
    isAccepted: boolean,
    isDeclined: boolean,
  ) => {
    if (isAccepted && basiliumTermsOfUse.isAccepted) {
      setBasiliumTermsOfUse({
        ...basiliumTermsOfUse,
        isAccepted: false,
      });
    }
    if (isAccepted && !basiliumTermsOfUse.isAccepted) {
      setBasiliumTermsOfUse({
        ...basiliumTermsOfUse,
        isAccepted: true,
        isDeclined: false,
      });
    }
    if (isDeclined && basiliumTermsOfUse.isDeclined) {
      setBasiliumTermsOfUse({
        ...basiliumTermsOfUse,
        isDeclined: false,
      });
    }
    if (isDeclined && !basiliumTermsOfUse.isDeclined) {
      setBasiliumTermsOfUse({
        ...basiliumTermsOfUse,
        isAccepted: false,
        isDeclined: true,
      });
    }
  };

  const onClickPrivatePolicy = (isAccepted: boolean, isDeclined: boolean) => {
    if (isAccepted && privatePolicy.isAccepted) {
      setPrivatePolicy({
        ...privatePolicy,
        isAccepted: false,
      });
    }
    if (isAccepted && !privatePolicy.isAccepted) {
      setPrivatePolicy({
        ...privatePolicy,
        isAccepted: true,
        isDeclined: false,
      });
    }
    if (isDeclined && privatePolicy.isDeclined) {
      setPrivatePolicy({
        ...privatePolicy,
        isDeclined: false,
      });
    }
    if (isDeclined && !privatePolicy.isDeclined) {
      setPrivatePolicy({
        ...privatePolicy,
        isAccepted: false,
        isDeclined: true,
      });
    }
  };

  return {
    basiliumTermsOfUse,
    privatePolicy,
    onClickBasiliumTermsOfUse,
    onClickPrivatePolicy,
  };
}

export { useTermsOfUse };
