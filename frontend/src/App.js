import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
} from "@mui/material";

function App() {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const API_URL = "http://localhost:5000/api/products"; 

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setNewTitle(product.title);
    setOpenDialog(true);
  };

  const handleSave = () => {
    axios
      .put(`${API_URL}/${selectedProduct._id}`, { title: newTitle })
      .then((res) => {
        setProducts(
          products.map((p) => (p._id === res.data._id ? res.data : p))
        );
        setSnackbarOpen(true);
        setOpenDialog(false);
      })
      .catch((err) => console.error(err));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    axios
      .post(API_URL, newProduct)
      .then((res) => {
        setProducts([...products, res.data]);
        alert("Product added successfully!");
        setNewProduct({
          title: "",
          price: "",
          description: "",
          category: "",
          image: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" my={2}>
        Product List
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem
            key={product._id}
            secondaryAction={
              <Button variant="contained" onClick={() => handleEdit(product)}>
                Edit
              </Button>
            }
          >
            <ListItemText
              primary={product.title}
              secondary={`$${product.price}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Product Title</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="Product updated successfully"
        onClose={() => setSnackbarOpen(false)}
      />

      {/* Add New Product Form */}
      <Typography variant="h4" my={2}>
        Add New Product
      </Typography>
      <form onSubmit={handleAddProduct}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          required
          value={newProduct.title}
          onChange={(e) =>
            setNewProduct({ ...newProduct, title: e.target.value })
          }
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          required
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        />
        <TextField
          label="Image URL"
          fullWidth
          margin="normal"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Product
        </Button>
      </form>
    </Container>
  );
}

export default App;

