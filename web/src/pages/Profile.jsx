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
import axios from "../axios";
import { useForm } from "react-hook-form";

export default function UserProfileEdit() {
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      contact: user?.contact || "",
      dob: user?.dob || "",
      gender: user?.gender || "",
      qualification: user?.qualification || "",
      profile: user?.profile || "",
      email: user?.email || "",
    },
  });

  const submitHandler = async (values) => {
    const {
      first_name,
      last_name,
      contact,
      dob,
      gender,
      profile,
      qualification,
    } = values;
    try {
      await axios.post(
        "/api/user/update-profile",
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
            <Avatar size="xl" src={""}></Avatar>
          </Center>
        </FormControl>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
          <FormControl isRequired isInvalid={errors.first_name}>
            <FormLabel htmlFor="first_name">First Name</FormLabel>
            <Input
              type="text"
              id="first_name"
              name="first_name"
              {...register("first_name", {
                required: "First Name is required",
              })}
            />
            <FormErrorMessage>
              {errors.first_name && errors.first_name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="last_name">Last Name</FormLabel>
            <Input type="text" id="last_name" {...register("last_name")} />
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
          <FormControl isRequired isInvalid={errors.contact}>
            <FormLabel htmlFor="contact">Contact</FormLabel>
            <Input
              type="text"
              id="contact"
              {...register("contact", {
                required: "contact is required",
              })}
            />
            <FormErrorMessage>
              {errors.contact && errors.contact.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.dob}>
            <FormLabel htmlFor="dob">DOB</FormLabel>
            <Input
              type="date"
              id="dob"
              name="dob"
              {...register("dob", {
                required: "dob is required",
              })}
            />
            <FormErrorMessage>
              {errors.dob && errors.dob.message}
            </FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={3}>
          <FormControl
            className="form-floating"
            isRequired
            isInvalid={errors.gender}
          >
            <FormLabel htmlFor="gender">Gender</FormLabel>
            <Select
              placeholder="Select Gender"
              {...register("gender", {
                required: "gender is required",
              })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <FormErrorMessage>
              {errors.gender && errors.gender.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            className="form-floating"
            isRequired
            isInvalid={errors.qualification}
          >
            <FormLabel htmlFor="qualification">Highest Qualification</FormLabel>
            <Select
              placeholder="Select Qualification"
              {...register("qualification", {
                required: "qualification is required",
              })}
            >
              <option value="">All</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
            <FormErrorMessage>Qualification is required</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <FormControl spacing={3}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            disabled
          />
        </FormControl>
        <Button
          colorScheme="green"
          variant="outline"
          onClick={handleSubmit(submitHandler)}
          isLoading={isSubmitting}
          loadingText="Updating"
        >
          Update
        </Button>
      </Stack>
    </Flex>
  );
}
