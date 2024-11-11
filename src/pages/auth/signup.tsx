import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/src/utils/trpc";
import { toast } from "react-hot-toast";
import Button from "@/src/components/ui/Button";
import Head from "next/head";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+,\-.:;'"?~`]{8,}$/;


const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long')
    .regex(passwordRegex, 'Password must contain at least one uppercase, lowercase, one digit'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters long')
    .regex(passwordRegex, 'Password must contain at least one uppercase, lowercase, one digit'),
});
type SignUpInputs = z.infer<typeof schema>;

const SignUp = () => {
  const router = useRouter();
  const signUpMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/app")
    },
    onError: (e) => {
      if (e.message.includes('Email already in use')) {
        toast.error('Email already in use');
      } else {
        toast.error(e.message);
      }
    },
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpInputs>({ resolver: zodResolver(schema), mode: "all" });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const isPasswordMatching = password === confirmPassword;

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await signUpMutation.mutateAsync({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <>
      <Head>
        <title>Sign Up | Siddharth-Electricals</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pt-52 sm:w-[95vw] md:pt-40">
        <div className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2.5">
            <fieldset className="grid gap-2">
              <label htmlFor="email" className="text-xs font-medium text-title md:text-sm">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </fieldset>
            <fieldset className="grid gap-2">
              <label htmlFor="password" className="text-xs font-medium text-title md:text-sm">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </fieldset>
            <fieldset className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-title md:text-sm">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </fieldset>
            <Button
              aria-label="sign up"
              className="w-full"
              disabled={!isPasswordMatching || signUpMutation.isLoading}
            >
              {signUpMutation.isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignUp;
