import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  useToast,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// eslint-disable-next-line react/prop-types
const Form2 = ({ setStep }) => {
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
    },
  });
  const submitHandler = async (values) => {
    const { contact, dob, gender, qualification, profile } = values;
    try {
      await axios.post(
        "/api/user/update-profile",
        {
          contact,
          dob,
          gender,
          qualification,
          profile,
        },
        { headers: { "login-token": user?.token } }
      );
      setStep(3);
      toast({
        title: "Account Setup successfully",
        description: "Hurray, You completed your profile",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      let updatedUser = { ...user, contact, dob, gender, qualification };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("step", 3);
      return;
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

  const uploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("profile", file);
      const response = await axios.post(
        "http://localhost:8080/api/user/upload-profile",
        formData,
        {
          headers: {
            "login-token": user?.token,
            "content-type": "multipart/form-data",
          },
        }
      );
      // setFormValues({ ...formValues, profile: response.data.imageUrl });
      toast({
        title: "Profile Updated successfully",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Update Your Details
      </Heading>
      <Flex mt={"2%"}>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="First name"
            name="first_name"
            isDisabled={true}
            {...register("first_name")}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={"normal"}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            placeholder="Last name"
            name="last_name"
            {...register("last_name")}
            isDisabled={true}
          />
        </FormControl>
      </Flex>
      <Flex mt={"2%"}>
        <FormControl mr="5%" isInvalid={errors.contact}>
          <FormLabel htmlFor="contact" fontWeight={"normal"}>
            Contact
          </FormLabel>
          <Input
            type="text"
            id="contact"
            placeholder="Contact Number"
            name="contact"
            {...register("contact", {
              required: "contact is required",
            })}
          />
          <FormErrorMessage>
            {errors.contact && errors.contact.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.dob}>
          <FormLabel htmlFor="dob" fontWeight={"normal"}>
            DOB
          </FormLabel>
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
      </Flex>

      <Flex mt={"2%"}>
        <FormControl
          className="form-floating"
          mr={"5%"}
          isInvalid={errors.gender}
        >
          <FormLabel
            htmlFor="gender"
            fontSize="sm"
            fontWeight="sm"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Gender
          </FormLabel>
          <Select
            placeholder="Select Gender"
            // selected={gender}
            id="gender"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
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
        <FormControl className="form-floating" isInvalid={errors.qualification}>
          <FormLabel
            htmlFor="qualification"
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Highest Qualification
          </FormLabel>
          <Select
            placeholder="Select Qualification"
            // selected={qualification}
            // onChange={changeHandler}
            name="qualification"
            id="qualification"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
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
      </Flex>
      <FormControl>
        <FormLabel htmlFor="profile" fontWeight={"normal"}>
          Profile
        </FormLabel>
        <input type="file" id="profile" name="profile" onChange={uploadImage} />
      </FormControl>
      <Button
        colorScheme="teal"
        variant="outline"
        w={"7rem"}
        mt={"3%"}
        onClick={handleSubmit(submitHandler)}
        isLoading={isSubmitting}
        loadingText="Submitting"
      >
        Submit
      </Button>
    </>
  );
};

// eslint-disable-next-line react/prop-types
const Form1 = ({ setStep }) => {
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitHandler = async (values) => {
    const { password, confirmPassword, email, first_name, last_name } = values;

    if (password != confirmPassword) {
      toast({
        title: "Invalid password",
        description: "Password not matched",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axios.post("/api/user/register", {
        email,
        password,
        first_name,
        last_name,
      });
      setStep(2);
      toast({
        title: "Account created",
        description: "Hurray, You completed your first step",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          first_name,
          last_name,
          email,
          token: response.data.data.token,
        })
      );
      localStorage.setItem("step", 2);
      return;
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
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        User Registration
      </Heading>
      <Flex mt={"2%"}>
        <FormControl mr="5%" isInvalid={errors.first_name} isRequired>
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="First name"
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
          <FormLabel htmlFor="last-name" fontWeight={"normal"}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            placeholder="Last name"
            name="last_name"
            {...register("last_name")}
          />
        </FormControl>
      </Flex>
      <FormControl mt="2%" isInvalid={errors.email} isRequired>
        <FormLabel htmlFor="email" fontWeight={"normal"}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.password} isRequired>
        <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
          Password
        </FormLabel>
        <Input
          pr="4.5rem"
          type="password"
          id="password"
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum length should be 8" },
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.confirmPassword} isRequired>
        <FormLabel
          htmlFor="confirmPassword"
          fontWeight={"normal"}
          mt="2%"
          isInvalid={errors.confirmPassword}
        >
          Confirm Password
        </FormLabel>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            minLength: { value: 8, message: "Minimum length should be 8" },
          })}
        />
        <FormErrorMessage>
          {errors.confirmPassword && errors.confirmPassword.message}
        </FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="teal"
        variant="outline"
        w={"9rem"}
        mt={"3%"}
        onClick={handleSubmit(submitHandler)}
        isLoading={isSubmitting}
        loadingText="Submitting"
      >
        Create Account
      </Button>
      <Stack
        direction={{ base: "column", sm: "row" }}
        align={"start"}
        justify={"space-between"}
        mt={"2%"}
      >
        <Text as={Link} to={"/login"} color={"blue.400"}>
          Already have account ?
        </Text>
      </Stack>
    </>
  );
};

const Register = () => {
  const [step, setStep] = useState(parseInt(localStorage.getItem("step")) || 1);
  const navigate = useNavigate();
  const user = localStorage.getItem("user") || null;
  useEffect(() => {
    if (step > 2 && user) navigate("/profile");
  }, [navigate, step, user]);

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        {step === 1 ? <Form1 setStep={setStep} /> : <Form2 setStep={setStep} />}
      </Box>
    </>
  );
};

export default Register;
