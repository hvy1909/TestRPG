import React, { useState, useEffect } from "react";

function MyForm() {
  const [inputValue, setInputValue] = useState(""); // State để lưu giá trị input
  const [numbers, setNumbers] = useState([]); // State để lưu trữ các số cần hiển thị
  const [time, setTime] = useState(0); // State để lưu trữ thời gian
  const [isRunning, setIsRunning] = useState(false); // State để kiểm tra xem đồng hồ có đang chạy không
  const [clickedNumbers, setClickedNumbers] = useState([]); // State để lưu trữ các số đã nhấn
  const [message, setMessage] = useState(""); // State để hiển thị thông báo hoàn thành/thất bại
  const [positions, setPositions] = useState([]); // State để lưu trữ vị trí của các số

  // Hàm xử lý khi input thay đổi
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Cập nhật giá trị input
  };

  // Hàm xử lý khi nhấn nút Start
  const handleStartClick = () => {
    const parsedValue = parseInt(inputValue); // Chuyển đổi input thành số
    if (!isNaN(parsedValue) && parsedValue > 0) {
      // Tạo mảng các số từ 1 đến giá trị đã nhập
      const newNumbers = Array.from({ length: parsedValue }, (_, i) => i + 1);
      setNumbers(shuffleArray(newNumbers)); // Cập nhật state với mảng số được xáo trộn

      // Tạo vị trí ngẫu nhiên cho các số
      const newPositions = newNumbers.map(() => generateRandomPosition());
      setPositions(newPositions);

      setTime(0); // Đặt lại thời gian về 0
      setIsRunning(true); // Bắt đầu đếm thời gian
      setClickedNumbers([]); // Reset các số đã nhấn
      setMessage(""); // Reset thông báo
    } else {
      setNumbers([]); // Nếu giá trị không hợp lệ, xóa tất cả số
      setPositions([]); // Xóa tất cả các vị trí
      setIsRunning(false); // Ngừng đếm thời gian
    }
  };

  // Sử dụng useEffect để tạo bộ đếm thời gian
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1); // Cập nhật thời gian mỗi 0.1 giây
      }, 100); // Thời gian chạy mỗi 100ms (0.1 giây)
    }

    // Hủy bỏ timer khi component unmount hoặc khi không chạy
    return () => clearInterval(timer);
  }, [isRunning]);

  // Hàm xử lý khi nhấn vào một số
  const handleNumberClick = (number) => {
    const nextExpectedNumber = clickedNumbers.length + 1;

    // Kiểm tra nếu số được nhấn là số đúng theo thứ tự
    if (number === nextExpectedNumber) {
      setClickedNumbers((prev) => [...prev, number]);

      // Kiểm tra nếu người dùng đã nhấn hết tất cả các số
      if (number === numbers.length) {
        setMessage("Hoàn thành!"); // Hiển thị thông báo hoàn thành
        setIsRunning(false); // Ngừng đếm thời gian
      }
    } else {
      // Nếu nhấn sai số, thông báo thất bại và dừng trò chơi
      setMessage("Thất bại! Bạn đã nhấn sai số.");
      setIsRunning(false); // Ngừng đếm thời gian
    }
  };

  // Hàm xáo trộn mảng để các số xuất hiện ngẫu nhiên
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Tạo vị trí ngẫu nhiên cho mỗi số
  const generateRandomPosition = () => {
    const top = Math.random() * 260; // Giới hạn chiều cao 300px trừ khoảng padding
    const left = Math.random() * 560; // Giới hạn chiều rộng 600px trừ khoảng padding
    return { top, left };
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form
        action="#"
        style={{
          width: "650px",
          border: "1px solid black",
          padding: "20px",
          borderRadius: "8px",
        }}
        onSubmit={(e) => e.preventDefault()} // Ngăn chặn refresh trang khi submit form
      >
        <h2>{message}</h2> {/* Hiển thị thông báo */}
        <h1>Let's Play</h1>
        <div
          style={{
            width: "400px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <p>Points:</p>
          <input
            style={{
              flex: 1,
              marginLeft: "10px",
              height: "20px",
              marginTop: "15px",
            }}
            type="number" // Input kiểu số
            value={inputValue} // Gán giá trị của input với state
            onChange={handleInputChange} // Xử lý khi thay đổi input
          />
        </div>
        <div
          style={{
            width: "100px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <p>Time:</p>
          <span style={{ marginTop: "15px" }}>{time.toFixed(1)}s</span>{" "}
          {/* Hiển thị thời gian */}
        </div>
        <button
          type="button" // Nút là kiểu button, không phải submit
          style={{ padding: "10px 20px", cursor: "pointer" }}
          onClick={handleStartClick} // Xử lý khi nhấn nút Start
        >
          Start
        </button>
        <div
          className="content"
          style={{
            width: "600px",
            height: "300px",
            border: "1px solid black",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "20px",
            position: "relative", // Để các số có thể di chuyển tự do trong container
            overflowY: "auto",
          }}
        >
          {/* Hiển thị các số trong div content */}
          {numbers.map((number, index) => {
            const { top, left } = positions[index] || {};
            return (
              <span
                key={number}
                onClick={() => handleNumberClick(number)} // Xử lý khi nhấn vào số
                style={{
                  position: "absolute", // Đặt vị trí tuyệt đối cho số
                  top: `${top}px`,
                  left: `${left}px`,
                  display: "inline-block",
                  border: "1px solid black",
                  borderRadius: "50%",
                  height: "40px",
                  width: "40px",
                  lineHeight: "40px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: clickedNumbers.includes(number)
                    ? "lightgreen"
                    : "white", // Đổi màu nếu số đã được nhấn
                }}
              >
                {number}
              </span>
            );
          })}
        </div>
      </form>
    </div>
  );
}

export default MyForm;
