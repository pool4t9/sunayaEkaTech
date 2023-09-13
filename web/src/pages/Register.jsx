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
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validate } from "../helper";

// eslint-disable-next-line react/prop-types
const Form2 = ({ setStep }) => {
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    contact: user?.contact || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    qualification: user?.qualification || "",
    profile: user?.profile || "",
  });

  const {
    first_name,
    last_name,
    contact,
    dob,
    qualification,
    gender,
    profile,
  } = formValues;
  const changeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const tempError = validate(formValues);
    setErrors(tempError);
    if (Object.values(tempError).includes(true)) return;
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
    setLoading(false);
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
      setFormValues({ ...formValues, profile: response.data.imageUrl });
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
        <FormControl mr="5%" isInvalid={errors.first_nameError}>
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="First name"
            name="first_name"
            value={first_name}
            onChange={changeHandler}
            isDisabled={true}
          />
          <FormErrorMessage>First Name is required</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={"normal"}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            placeholder="First name"
            name="last_name"
            value={last_name}
            onChange={changeHandler}
            isDisabled={true}
          />
        </FormControl>
      </Flex>
      <Flex mt={"2%"}>
        <FormControl mr="5%" isInvalid={errors.contactError}>
          <FormLabel htmlFor="contact" fontWeight={"normal"}>
            Contact
          </FormLabel>
          <Input
            type="text"
            id="contact"
            placeholder="Contact Number"
            name="contact"
            value={contact}
            onChange={changeHandler}
          />
          <FormErrorMessage>Contact is required</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.dobError}>
          <FormLabel htmlFor="dob" fontWeight={"normal"}>
            DOB
          </FormLabel>
          <Input
            type="date"
            id="dob"
            name="dob"
            value={dob}
            onChange={changeHandler}
          />
          <FormErrorMessage>Date of Birth is required</FormErrorMessage>
        </FormControl>
      </Flex>

      <Flex mt={"2%"}>
        <FormControl
          className="form-floating"
          mr={"5%"}
          isInvalid={errors.genderError}
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
            selected={gender}
            onChange={changeHandler}
            name="gender"
            id="gender"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <FormErrorMessage>Gender is required</FormErrorMessage>
        </FormControl>
        <FormControl
          className="form-floating"
          isInvalid={errors.qualificationError}
        >
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
            selected={qualification}
            onChange={changeHandler}
            name="qualification"
            id="qualification"
            focusBorderColor="brand.400"
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
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
        onClick={submitHandler}
        isLoading={loading}
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
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { first_name, last_name, email, password, confirmPassword } =
    formValues;

  const changeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const tempError = validate(formValues);
    setErrors(tempError);
    if (Object.values(tempError).includes(true)) return;
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
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        {
          email,
          password,
          first_name,
          last_name,
        }
      );
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
    setLoading(false);
  };

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        User Registration
      </Heading>
      <Flex mt={"2%"}>
        <FormControl mr="5%" isInvalid={errors.first_nameError}>
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="First name"
            name="first_name"
            value={first_name}
            onChange={changeHandler}
          />
          <FormErrorMessage>First Name is required</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={"normal"}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            placeholder="Last name"
            name="last_name"
            value={last_name}
            onChange={changeHandler}
          />
        </FormControl>
      </Flex>
      <FormControl mt="2%" isInvalid={errors.emailError}>
        <FormLabel htmlFor="email" fontWeight={"normal"}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          value={email}
          name="email"
          onChange={changeHandler}
        />
        <FormErrorMessage>Email is required</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.passwordError}>
        <FormLabel htmlFor="password" fontWeight={"normal"} mt="2%">
          Password
        </FormLabel>
        <Input
          pr="4.5rem"
          type="password"
          id="password"
          placeholder="Enter password"
          name="password"
          value={password}
          onChange={changeHandler}
        />
        <FormErrorMessage>Password is required</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel
          htmlFor="confirmPassword"
          fontWeight={"normal"}
          mt="2%"
          isInvalid={errors.confirmPasswordError}
        >
          Confirm Password
        </FormLabel>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={changeHandler}
        />
        <FormErrorMessage>Confirm password is required</FormErrorMessage>
      </FormControl>
      <Button
        colorScheme="teal"
        variant="outline"
        w={"9rem"}
        mt={"3%"}
        onClick={submitHandler}
        isLoading={loading}
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
