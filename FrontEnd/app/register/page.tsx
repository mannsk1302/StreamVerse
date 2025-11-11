"use client";
import { useState } from "react";
import api from "@/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e: { target: { name: any; value: any; files: any; }; }) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("username", form.username.toLowerCase());
    formData.append("password", form.password);

    if (form.avatar) formData.append("avatar", form.avatar);
    if (form.coverImage) formData.append("coverImage", form.coverImage);

    try {
      const res = await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Registration successful!");
      console.log(res.data);
    } catch (er) {
      // @ts-ignore
        console.error("Registration Error:", er.response?.data || er.message);
      // @ts-ignore
        alert(er.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Create Account</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-[300px] bg-white p-4 rounded-xl shadow-md"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <div>
          <label className="text-sm text-gray-600">Avatar (required):</label>
          <input type="file" name="avatar" onChange={handleChange} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Cover Image (optional):</label>
          <input type="file" name="coverImage" onChange={handleChange} />
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}