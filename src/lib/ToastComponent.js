import { toast } from "sonner";

const SelectExpDateToast = () => {
  toast("Select an EXPIRY DATE.", {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};

const SelectIndexExpDateToast = () => {
  toast("Select an INDEX and EXPIRY DATE First.", {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};

const SelectIndexExpDateStrikeToast = () => {
  toast("Select an INDEX, EXPIRY DATE and STRIKE. ", {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};

const failedToLoadDateToast = () => {
  toast("FAILED to LOAD DATES. ", {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};

const SelectStrikeToast = () => {
  toast("SELECT a STRIKE", {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};

export {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
  SelectStrikeToast,
};
