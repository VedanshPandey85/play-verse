import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const decodedToken = jwt_decode(token);
      if (decodedToken.role !== "admin") {
        setError("You are not authorized to access this page.");
        navigate("/user");
      }
    }
  }, [navigate]);

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <h2 className="text-center text-2xl">Welcome to the Admin Page</h2>
      )}
    </div>
  );
};

export default AdminPage;
