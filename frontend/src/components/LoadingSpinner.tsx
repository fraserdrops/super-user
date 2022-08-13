// from https://loading.io/css/
function LoadingSpinner() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}
    >
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
