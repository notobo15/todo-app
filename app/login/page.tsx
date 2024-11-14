"use client";
import { useState, FormEvent } from "react";
import styles from "./login.module.scss";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

interface Errors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await handleAuth();
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleAuth = async () => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Đăng nhập thành công.", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(result.message || "Đăng nhập không thành công.", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đăng Nhập</h2>
      <div className={styles.line}></div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="Email">Email</label>
          <input
            id="Email"
            type="text"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <div className={styles.errorMessage}>{errors.email}</div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="Password">Mật khẩu</label>
          <div className={styles.passwordWrapper}>
            <input
              id="Password"
              type={showPassword ? "text" : "password"}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={toggleShowPassword}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {errors.password && (
            <div className={styles.errorMessage}>{errors.password}</div>
          )}
        </div>
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}
        <button type="submit" className={styles.submitButton}>
          Đăng Nhập
        </button>
      </form>
      <Link href={"/register"} className={styles.registerBtn}>
        Đăng Kí Ngay
      </Link>
    </div>
  );
}
