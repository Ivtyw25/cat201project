import Nav from "../components/Nav"
import { useState, useEffect } from "react"
import { FaShoppingBag, FaTruck, FaDollarSign, FaPlus } from "react-icons/fa"
import { readCardEndpoint, readOrderEndpoint } from "../constants"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Admin = () => {
  const [orders, setOrders] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    rarity: "",
    image_url: "Default",
    category: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(readOrderEndpoint);

        setOrders(response.data);
        console.log("response", response);

        const calculatedTotalSales = response.data.reduce((acc, order) => {
          return acc + order.total_sales;  // Add up the total_sales from each order
        }, 0);
        setTotalSales(calculatedTotalSales.toFixed(2));
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchOrder();

  }, [])

  const handleShipOrder = async (order_id) => {
    try {
      console.log(order_id)
      await fetch(readOrderEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=shipOrder&orderID=${order_id}`,
      });
  
      setOrders(orders.map(order =>
        order.id === order_id
          ? { ...order, status: 'Shipped' }
          : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  const handleAddCard = async (e) => {
    e.preventDefault()
    const response = await fetch(readCardEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        action: "addCard", // Include the action parameter
        ...formData,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Card added successfully! ID: ${data.id}`);
    } else {
      alert("Failed to add card. Please try again.");
    }
    setShowAddCardModal(false)
  }

  return (
    <main className="relative bg-gray-50 min-h-screen">
      <Nav noLinks={true} admin={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Logout Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/loginpage')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaShoppingBag size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold">{orders.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaDollarSign size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Sales</p>
                <h3 className="text-2xl font-bold">${totalSales}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 cursor-pointer"
               onClick={() => setShowAddCardModal(true)}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaPlus size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Add New Card</p>
                <h3 className="text-lg font-semibold">Click to add</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{order.order_id.slice(0,6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.total_sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status !== 'Shipped' && (
                        <button
                          onClick={() => handleShipOrder(order.order_id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <FaTruck className="mr-2" /> Ship
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
            <form onSubmit={handleAddCard}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Name</label>
                  <input
                      type="text"
                      name="name"
                      placeholder="Card Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                      type="number"
                      name="stock"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rarity</label>
                  <input
                      type="text"
                      name="rarity"
                      placeholder="Rarity"
                      value={formData.rarity}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                      />   
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCardModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Admin
