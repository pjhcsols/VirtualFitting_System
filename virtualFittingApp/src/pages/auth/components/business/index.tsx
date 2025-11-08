import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { Check, X } from "lucide-react";
import { validateBusiness } from "../../api/business.action";

interface IRegistration {
  registration: string;
  setRegistration: Dispatch<SetStateAction<string>>;
}

interface IValidation {
  message: string;
  isValid: boolean;
}

function CheckRegistration({ registration, setRegistration }: IRegistration) {
  const [validation, setValidation] = useState<IValidation>({
    message: "",
    isValid: false,
  });

  const handleRegistration = (e: ChangeEvent<HTMLInputElement>): void => {
    setRegistration(e.target.value);
  };

  const handleValidate = async () => {
    const res = await validateBusiness(registration);
    if (res === true) {
      setValidation({
        ...validation,
        isValid: true,
      });
    } else {
      setValidation({
        ...validation,
        message: "사업자 등록번호가 잘못되었습니다.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-2x rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">사업자 등록증</h2>
        <div className="space-y-8">
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={registration}
                onChange={handleRegistration}
                placeholder="xxxxxx"
                className="flex-1 h-12 px-4  border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-gray-800"
                maxLength={20}
              />
              <button
                onClick={handleValidate}
                className="h-12 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                확인
              </button>
            </div>
            {validation && (
              <div
                className={`mt-4 p-4 rounded-lg border-2 flex items-start gap-3 ${
                  validation.isValid ? " border-green-200" : "border-red-200"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    validation.isValid ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {validation.isValid ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      validation.isValid ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {validation.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { CheckRegistration };
