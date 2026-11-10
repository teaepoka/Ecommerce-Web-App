import { useEffect, useState } from "react";
import { getProfile, updateBalance } from "../api/users";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError("Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (Number(amount) <= 0) {
      setMessage("Please enter an amount greater than 0.");
      return;
    }

    setMessage("");
    setUpdating(true);

    try {
      await updateBalance(Number(amount));
      await fetchProfile();

      setAmount("");
      setMessage("Money added successfully!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Could not update your balance.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  if (error) return <p>{error}</p>;

  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <h1>My Profile</h1>

      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>

      <h2>Wallet</h2>
      <p>Balance: {profile.walletBalance}</p>

      <form onSubmit={handleAddMoney}>
        <label>Amount to add:</label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button type="submit" disabled={updating}>
          {updating ? "Adding..." : "Add Money"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Statistics</h2>
      <p>Products sold: {profile.productsSold}</p>
      <p>Products bought: {profile.productsBought}</p>
    </div>
  );
}

export default Profile;
