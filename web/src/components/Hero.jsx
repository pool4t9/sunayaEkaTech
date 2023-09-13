import { Link as ReactRouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from "@chakra-ui/react";

const Hero = () => {
  return (
    <Container maxW={"3xl"}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Sunaya <br />
          <Text as={"span"} color={"green.400"}>
            {/* your audience */}
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Programming is the art of algorithm design and the craft of debugging
          errant code.
        </Text>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Button
            as={ReactRouterLink}
            colorScheme={"green"}
            bg={"green.400"}
            rounded={"full"}
            px={6}
            to={"/login"}
            _hover={{
              bg: "green.500",
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Hero;