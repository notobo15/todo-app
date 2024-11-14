"use client";
import { useState, FormEvent } from "react";
import styles from "./register.module.scss";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { toast } from "react-toastify";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      newErrors.name = "Tên không được để trống.";
    }

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
      await handleRegister();
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const handleRegister = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast.success("Đăng ký thành công. Bạn có thể đăng nhập.", {
          position: "top-center",
          autoClose: 1000,
        });
        setName("");
        setEmail("");
        setPassword("");
        setErrors({});
      } else {
        const result = await response.json();
        toast.error(result.message || "Đăng ký không thành công.", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <div>
      <div className={styles.containerRegister}>
        <h2
          style={{
            fontSize: "21px",
            textAlign: "center",
            paddingTop: "20px",
          }}
        >
          Đăng Ký
        </h2>
        <div className={styles.line}></div>
        <form onSubmit={handleSubmit} className={styles.formRegister}>
          {/* Name Field */}
          <div className={styles.nameField}>
            <label htmlFor="Name">Tên</label>
            <input
              id="Name"
              type="text"
              className={styles.ipName}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className={styles.errorsField}>{errors.name}</div>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.emailField}>
            <label htmlFor="Email">Email</label>
            <input
              id="Email"
              type="text"
              className={styles.ipEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className={styles.errorsField}>{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.passField}>
            <label htmlFor="Password">Mật khẩu</label>
            <div className={styles.formGroup}>
              <input
                id="Password"
                type={showPassword ? "text" : "password"}
                className={styles.ipPass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.btnShow}
                onClick={toggleShowPassword}
              >
                {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.password && (
              <div className={styles.errorsField}>{errors.password}</div>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {/* Submit Button */}
          <button type="submit" className={styles.btnRegister}>
            Đăng Ký
          </button>
        </form>
        <Link href={"/login"} className={styles.registerBtn}>
          Đăng Nhập
        </Link>
      </div>
    </div>
  );
}
