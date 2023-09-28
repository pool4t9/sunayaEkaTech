import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
} from "@chakra-ui/react";

const AlertBanner = ({ status, title, message }) => {
  return (
    <Container maxWidth={"700px"} marginTop={"50px"}>
      <Alert status={status}>
        <AlertIcon />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Container>
  );
};

export default AlertBanner;
