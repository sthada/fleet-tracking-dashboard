export function getLabelClass(status) {
    switch (status) {
      case "en_route":
        return "col-sm cyan label-pill";
      case "delivered":
        return "col-sm green label-pill";
      default:
        return "col-sm gray label-pill";
    }
  }
  export function getProgressClass(num) {
    switch (true) {
      case (num<=20):
        return "progress-bar danger";
      case (num<=40):
        return "progress-bar warning";
      default:
        return "progress-bar green";
    }
  }

  export function dateUtil (dateString){

  return new Date(dateString);
  }

  