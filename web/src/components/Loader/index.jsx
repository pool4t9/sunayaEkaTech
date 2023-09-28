import { Spinner } from "@chakra-ui/react";
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="black.500"
        size="xl"
        width="100px"
        height="100px"
      />
    </div>
  );
};

export default Loader;
