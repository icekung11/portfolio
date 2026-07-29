import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
from scipy.integrate import quad
import tkinter as tk
from tkinter import ttk, messagebox
import os

class FourierFinalApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Fourier series Calculator & Plotter")
        self.root.geometry("1100x850")
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.setup_ui()

    def setup_ui(self):
        ctrl_frame = ttk.LabelFrame(self.root, text="1. Interval & Function Configuration ", padding=15)
        ctrl_frame.pack(fill="x", padx=20, pady=10)

        # ขอบเขต a, b (เพื่อหา T และ L)
        ttk.Label(ctrl_frame, text="ขอบเขตซ้าย (a):").grid(row=0, column=0)
        self.left_entry = ttk.Entry(ctrl_frame, width=12); self.left_entry.insert(0, "-pi")
        self.left_entry.grid(row=0, column=1, padx=5)

        ttk.Label(ctrl_frame, text="ขอบเขตขวา (b):").grid(row=0, column=2)
        self.right_entry = ttk.Entry(ctrl_frame, width=12); self.right_entry.insert(0, "pi")
        self.right_entry.grid(row=0, column=3, padx=5)

        self.mode_var = tk.StringVar(value="Single")
        self.mode_combo = ttk.Combobox(ctrl_frame, textvariable=self.mode_var, values=["Single", "Piecewise"], state="readonly", width=12)
        self.mode_combo.grid(row=0, column=5, padx=5)
        self.mode_combo.bind("<<ComboboxSelected>>", lambda e: self.toggle_mode())

        # ฟังก์ชัน
        self.lbl_f1 = ttk.Label(ctrl_frame, text="f1(x):")
        self.lbl_f1.grid(row=1, column=0, pady=10)
        self.f1_entry = ttk.Entry(ctrl_frame, width=30); self.f1_entry.insert(0, "-x")
        self.f1_entry.grid(row=1, column=1, columnspan=2, padx=5, sticky="w")

        ttk.Label(ctrl_frame, text="จำนวนพจน์ (N):").grid(row=1, column=3)
        self.n_entry = ttk.Entry(ctrl_frame, width=10); self.n_entry.insert(0, "4")
        self.n_entry.grid(row=1, column=4)

        # ส่วน Piecewise
        self.lbl_f2 = ttk.Label(ctrl_frame, text="f2(x):")
        self.f2_entry = ttk.Entry(ctrl_frame, width=30); self.f2_entry.insert(0, "x")
        self.lbl_split = ttk.Label(ctrl_frame, text="จุดแบ่ง (Split):")
        self.split_entry = ttk.Entry(ctrl_frame, width=10); self.split_entry.insert(0, "0")

        ttk.Button(ctrl_frame, text="Calculate & Plot (3 Periods)", command=self.process).grid(row=3, column=0, columnspan=6, pady=10)

        # สมการ
        self.formula_box = tk.Text(self.root, height=3, font=("Consolas", 11), bg="#f8f9fa", state="disabled", padx=10, pady=10)
        self.formula_box.pack(fill="x", padx=20, pady=5)

        # กราฟ
        self.fig, self.ax = plt.subplots(figsize=(7, 4), dpi=100)
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.root)
        self.canvas.get_tk_widget().pack(fill="both", expand=True, padx=20, pady=10)
        self.toggle_mode()

    def toggle_mode(self):
        if self.mode_var.get() == "Piecewise":
            self.lbl_f2.grid(row=2, column=0); self.f2_entry.grid(row=2, column=1, columnspan=2, padx=5, sticky="w")
            self.lbl_split.grid(row=2, column=3); self.split_entry.grid(row=2, column=4)
        else:
            self.lbl_f2.grid_remove(); self.f2_entry.grid_remove(); self.lbl_split.grid_remove(); self.split_entry.grid_remove()

    def f_eval(self, x, expr):
        return eval(expr, {"__builtins__": None}, {"x": x, "np": np, "pi": np.pi, "sin": np.sin, "cos": np.cos, "abs": np.abs})

    def process(self):
        try:
            a = eval(self.left_entry.get(), {"np": np, "pi": np.pi})
            b = eval(self.right_entry.get(), {"np": np, "pi": np.pi})
            T = b - a
            L = T / 2 # ครึ่งคาบ L ตรงตามสูตรในรูป
            f1_str = self.f1_entry.get()
            N = int(self.n_entry.get())

            # 1. คำนวณสัมประสิทธิ์ตามสูตรในรูปภาพเป๊ะๆ
            if self.mode_var.get() == "Single":
                # a0 = 1/(2L) * integral
                a0, _ = quad(lambda x: self.f_eval(x, f1_str), a, b)
                a0 = a0 / (2 * L)
                
                a_coeffs, b_coeffs = [], []
                for n in range(1, N + 1):
                    # an = 1/L * integral(f(x)*cos(n*pi*x/L))
                    an, _ = quad(lambda x: self.f_eval(x, f1_str)*np.cos(n*np.pi*x/L), a, b)
                    bn, _ = quad(lambda x: self.f_eval(x, f1_str)*np.sin(n*np.pi*x/L), a, b)
                    a_coeffs.append(an/L); b_coeffs.append(bn/L)
            else:
                f2_str = self.f2_entry.get(); s = eval(self.split_entry.get(), {"np": np, "pi": np.pi})
                # a0 แยกสองช่วง
                a0_p1, _ = quad(lambda x: self.f_eval(x, f1_str), a, s)
                a0_p2, _ = quad(lambda x: self.f_eval(x, f2_str), s, b)
                a0 = (a0_p1 + a0_p2) / (2 * L)

                a_coeffs, b_coeffs = [], []
                for n in range(1, N + 1):
                    an1, _ = quad(lambda x: self.f_eval(x, f1_str)*np.cos(n*np.pi*x/L), a, s)
                    an2, _ = quad(lambda x: self.f_eval(x, f2_str)*np.cos(n*np.pi*x/L), s, b)
                    bn1, _ = quad(lambda x: self.f_eval(x, f1_str)*np.sin(n*np.pi*x/L), a, s)
                    bn2, _ = quad(lambda x: self.f_eval(x, f2_str)*np.sin(n*np.pi*x/L), s, b)
                    a_coeffs.append((an1 + an2)/L); b_coeffs.append((bn1 + bn2)/L)

            # 2. แสดงสมการและวาดกราฟ
            self.display_formula(a0, a_coeffs, b_coeffs, L, N)
            self.plot_result(a, b, T, L, a0, a_coeffs, b_coeffs, f1_str, N)

        except Exception as e: messagebox.showerror("Error", str(e))
    
    def display_formula(self, a0, a, b, L, N_limit):
        res = "f(x) = "
        count = 0
        if abs(a0) > 1e-4: res += f"{round(a0, 4)} "; count += 1
        
        for n in range(1, len(a) + 1):
            if count >= N_limit: break
            for coeff, func in [(a[n-1], "cos"), (b[n-1], "sin")]:
                if count < N_limit and abs(coeff) > 1e-4:
                    sign = " + " if coeff > 0 else " - "
                    if res == "f(x) = " and sign == " + ": sign = ""
                    
                    if np.isclose(L, np.pi):
                        inner = f"{n if n>1 else ''}x"
                    else:
                        l_v = round(L, 2)
                        inner = f"{n}πx/{l_v}" if n > 1 else f"πx/{l_v}"
                    
                    res += f"{sign}{abs(round(coeff, 4))}{func}({inner}) "
                    count += 1
        
        self.formula_box.config(state="normal"); self.formula_box.delete("1.0", tk.END)
        self.formula_box.insert("1.0", res + "+ ..."); self.formula_box.config(state="disabled")

    def plot_result(self, a, b, T, L, a0, a_coeffs, b_coeffs, f1_str, N):
        self.ax.clear()
        x_w = np.linspace(a - T, b + T, 1500)
        
        # ฟังก์ชันต้นฉบับ (เส้นประ)
        def periodic_f(xi):
            xw = ((xi - a) % T) + a
            if self.mode_var.get() == "Single": return self.f_eval(xw, f1_str)
            s = eval(self.split_entry.get(), {"np": np, "pi": np.pi})
            return self.f_eval(xw, f1_str if xw < s else self.f2_entry.get())

        y_o = [periodic_f(xi) for xi in x_w]
        
        # ฟังก์ชันฟูเรียร์ (เส้นแดง)
        y_f = np.full_like(x_w, a0)
        for n in range(1, N + 1):
            y_f += a_coeffs[n-1]*np.cos(n*np.pi*x_w/L) + b_coeffs[n-1]*np.sin(n*np.pi*x_w/L)
        
        self.ax.plot(x_w, y_o, 'k--', alpha=0.3, label="Original")
        self.ax.plot(x_w, y_f, 'r-', label=f"Fourier (N={N})")
        self.ax.axhline(0, color='black', lw=1); self.ax.grid(True, linestyle=':'); self.ax.legend(); self.canvas.draw()

    def on_closing(self):
        plt.close('all'); self.root.quit(); self.root.destroy(); os._exit(0)

if __name__ == "__main__":
    root = tk.Tk(); app = FourierFinalApp(root); root.mainloop()
