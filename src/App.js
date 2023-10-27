import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Rohan",
    image: "https://i.pravatar.cc/48?u=118880",
    balance: -7,
  },
  {
    id: 933372,
    name: "Rhea",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Aarush",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

// ..........REUSABLE COMPONENT............
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
//.....xxxxxx.......

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  //functionality of AddFriend
  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend); // to show addFriend form
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false); // to hide addFriend form
  }

  //Functionality of SplitBill
  function handleSelection(friend) {
    // setShowSplitBill(!showSplitBill); // to show splitBill form
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(false);
  }

  return (
    <div>
      <h1>Eat-n-Split</h1>
      <div className="app">
        <div className="sidebar">
          {/* ........FIRST COMPONENT RENDERED....... */}
          <FriendsList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />
          {/* ........SECOND COMPONENT RENDERED....... */}
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </div>
        {/* ........THIRD COMPONENT RENDERED....... */}
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}
//...X--X-X-X-X-X-X-X-X-X-X-

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <div>
      <li key={friend.id} className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name}></img>
        <h3>{friend.name}</h3>

        {/* ......Amount balance here......... */}
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} ₹{Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even. </p>}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owe you ₹{Math.abs(friend.balance)}{" "}
          </p>
        )}
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "close" : "select"}
        </Button>
      </li>
    </div>
  );
}
// x-x-x-x-x--x-x-x-x-x-x--x

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  //xxx-----------{ this would be called after clicking onSubmit button }------------xxx
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  } //xxx------------xxx

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🌃Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://"
      ></input>
      <Button>Add</Button>
    </form>
  );
}
// x-x-x-x-x-x-x-x-x-x-x-x-x-x-x

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>💸Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>💸{selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>📰Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
