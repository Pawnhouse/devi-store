import { useState } from 'react';

export default function FloatingLabelInput() {
    const [formData, setFormData] = useState({ name: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form>
            <div className="input-container">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="floating-input"
                />
                <label htmlFor="name">Фамилия Имя</label>
            </div>

            <style>{`
        .input-container {
          position: relative;
          margin: 20px 0;
          width: 300px;
        }

        .floating-input {
          width: 100%;
          border: none;
          border-bottom: 2px solid #1976d2;
          padding: 8px 0 6px 0;
          font-size: 16px;
          outline: none;
          background: transparent;
          transition: border-color 0.3s;
        }

        .floating-input:focus {
          border-bottom-color: #115293;
        }

        .floating-input::placeholder {
          color: transparent;
        }

        label {
          position: absolute;
          left: 0;
          bottom: 8px;
          color: #999;
          font-size: 16px;
          pointer-events: none;
          transition: transform 0.2s ease-out, font-size 0.2s ease-out, color 0.2s ease-out;
          transform-origin: left bottom;
        }

        .input-container:focus-within label,
        .floating-input:not(:placeholder-shown) + label {
          transform: translateY(-24px) scale(0.75);
          color: #1976d2;
          font-weight: 500;
        }
      `}</style>
        </form>
    );
}
