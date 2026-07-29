// ไฟล์: App.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import App from './App.jsx';

// ---------------------------------------------------------
// 🛠️ สเต็ป 1: สร้าง Firebase ปลอม (Mocking)
// ---------------------------------------------------------
import { addDoc, collection } from 'firebase/firestore';

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(() => 'mocked-time'),
    onSnapshot: vi.fn((query, callback) => {
      callback({ forEach: () => {} }); 
      return vi.fn(); 
    }),
    addDoc: vi.fn(),
  };
});

vi.mock('./firebase.js', () => ({
  db: {},
}));

// ---------------------------------------------------------
// 🧪 สเต็ป 2: เริ่มการทดสอบ (Testing)
// ---------------------------------------------------------
describe('Guestbook & Firebase Testing', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('ควรส่งข้อมูลลง Firebase ได้เมื่อกรอกชื่อและข้อความครบถ้วน', async () => {
    render(<App />);

    // 🎯 แก้คำค้นหาให้ตรงกับ placeholder ใน App.jsx
    const nameInput = screen.getByPlaceholderText(/Your Name/i); 
    const messageInput = screen.getByPlaceholderText(/Leave a message.../i); 
    
    // 🎯 แก้คำค้นหาปุ่มให้ตรงกับข้อความบนปุ่มใน App.jsx
    const sendButton = screen.getByRole('button', { name: /Send Message/i }); 

    // หุ่นยนต์จำลองการพิมพ์ข้อความ
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(messageInput, { target: { value: 'Great portfolio!' } });

    // หุ่นยนต์จำลองการกดคลิกปุ่มส่ง
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
    });

    expect(addDoc).toHaveBeenCalledWith(
      undefined, 
      expect.objectContaining({
        name: 'John Doe',
        message: 'Great portfolio!',
        createdAt: 'mocked-time'
      })
    );
  });

  test('ถ้าไม่พิมพ์ข้อความ (ช่องว่าง) ต้องไม่ส่งข้อมูลลง Firebase', async () => {
    render(<App />);
    
    // 🎯 เปลี่ยนเป็น Send Message
    const sendButton = screen.getByRole('button', { name: /Send Message/i });
    
    fireEvent.click(sendButton);

    // ตรวจสอบว่าต้องไม่มีการยิงข้อมูลออกไป
    expect(addDoc).not.toHaveBeenCalled();
  });

});