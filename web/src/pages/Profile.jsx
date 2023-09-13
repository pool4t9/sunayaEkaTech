import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  SimpleGrid,
  FormErrorMessage,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export default function UserProfileEdit() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [formValues, setFormValues] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    contact: user.contact || "",
    dob: user.dob || "",
    gender: user.gender || "",
    qualification: user.qualification || "",
    profile: user.profile || "",
  });

  const {
    first_name,
    last_name,
    email,
    contact,
    dob,
    qualification,
    profile,
    gender,
  } = formValues;

  const changeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/user/update-profile",
        {
          contact,
          dob,
          gender,
          qualification,
          profile,
          first_name,
          last_name,
        },
        { headers: { "login-token": user?.token } }
      );
      toast({
        title: "Account Update",
        description: "Hurray, Your Profile updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      let updatedUser = {
        ...user,
        contact,
        dob,
        gender,
        qualification,
        first_name,
        last_name,
        profile,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (e) {
      toast({
        title: "BAD REQUEST",
        description: e?.response?.data?.message || e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"2xl"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile
        </Heading>

        <FormControl id="userName">
          <Center>
            <Avatar size="xl" src={profile}></Avatar>
          </Center>
        </FormControl>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
          <FormControl>
            <FormLabel htmlFor="first_name">First Name</FormLabel>
            <Input
              type="text"
              id="first_name"
              name="first_name"
              value={first_name}
              onChange={changeHandler}
            />
            <FormErrorMessage>First Name is required</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="last_name">Last Name</FormLabel>
            <Input
              type="text"
              id="last_name"
              name="last_name"
              value={last_name}
              onChange={changeHandler}
            />
            <FormErrorMessage>Last Name is required</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
          <FormControl>
            <FormLabel htmlFor="contact">Contact</FormLabel>
            <Input
              type="text"
              id="contact"
              name="contact"
              value={contact}
              onChange={changeHandler}
            />
            <FormErrorMessage>Contact is required</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="dob">DOB</FormLabel>
            <Input
              type="date"
              id="dob"
              name="dob"
              value={dob}
              onChange={changeHandler}
            />
            <FormErrorMessage>Date of Birth is required</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
          <FormControl className="form-floating">
            <FormLabel htmlFor="gender">Gender</FormLabel>
            <Select
              placeholder="Select Gender"
              value={gender}
              onChange={changeHandler}
              name="gender"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>
          <FormControl className="form-floating">
            <FormLabel htmlFor="qualification">Highest Qualification</FormLabel>
            <Select
              placeholder="Select Qualification"
              value={qualification}
              onChange={changeHandler}
              name="qualification"
            >
              <option value="">All</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
        </SimpleGrid>
        <FormControl spacing={3}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            name="email"
            onChange={changeHandler}
            disabled
          />
        </FormControl>
        <Button
          colorScheme="green"
          variant="outline"
          onClick={submitHandler}
          isLoading={loading}
          loadingText="Updating"
        >
          Update
        </Button>
      </Stack>
    </Flex>
  );
}
