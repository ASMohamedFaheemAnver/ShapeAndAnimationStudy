import PropTypes from "prop-types";
const SvgColButton = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={8}
      fill="none"
      {...props}
    >
      <path
        fill={props?.fill ?? "#A8D07A"}
        d="M0 4a4 4 0 0 1 4-4h12a4 4 0 0 1 0 8H4a4 4 0 0 1-4-4Z"
      />
    </svg>
  );
};
SvgColButton.propTypes = {
  title: PropTypes.string,
  fill: PropTypes.string,
};
export default SvgColButton;
