import { Toaster } from "react-hot-toast";

const ToastWrapper = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 3000,
        style: {
          background: "#0b5394",
          color: "#ffffff",
        },
      }}
    />
  );
};

export default ToastWrapper;
