import { useNavigate } from "react-router-dom";
import PrimaryButton from "@buttons/PrimaryButton";
import Lottie from "lottie-react";
import Animation404 from "@assets/lotties/404.json";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-content-center flex-wrap w-10 mx-auto">
      <div className="w-full md:w-6">
        <Lottie animationData={Animation404} loop={true} />
      </div>
      <div className="my-auto w-full md:w-6">
        <div className="">
          <div className="text-2xl font-semibold mb-1 text-center text-color-primary">
            Page Not Found!
          </div>
          <div className="text-secondary mb-5 text-center">
            The page you're looking for doesn't exist or has been moved.
          </div>
          <div className="flex gap-3 justify-content-center">
            <PrimaryButton
              label="Back"
              icon="pi pi-arrow-left"
              onClick={() => navigate(-1)}
            />
            <PrimaryButton
              label="Go Home"
              icon="pi pi-home"
              className="p-button-primary"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
}
