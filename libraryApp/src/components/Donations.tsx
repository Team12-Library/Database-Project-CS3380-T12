import type React from 'react';
import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
  Grid,
} from '@mui/material';

const Donations: React.FC = () => {
  // state for selected donation amount
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // handle predefined amount selection
  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // reset custom amount if a predefined amount is selected
  };

  // handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null); // reset predefined amount if custom amount is entered
  };

  // retrieve user ID
  const getCustomerId = async (): Promise<number> => {
    // Replace this with actual logic to fetch the user's ID
    const response = await fetch('/api/auth/current-user');
    const user = await response.json();
    return user.id;
  };

  // handle donation submission
  const handleDonate = async () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount;

    // validate the amount
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }


    try {
      
      const customerID = await getCustomerId();

      const donationData = {
        CustomerID: customerID,
        Amount: amount,
        Date: new Date().toISOString(),
      };

      const response = await fetch('/api/Donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        throw new Error('Donation failed. Please try again.');
      }

      setDonationSuccess(true);
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('An error occurred while processing your donation. Please try again.');
    }
  };

  // Reset the form
  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setDonationSuccess(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Donate to the Library
        </Typography>

        {/* Donation Options */}
        <Typography variant="h6" gutterBottom>
          Choose an Amount
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedAmount === 5 ? 'contained' : 'outlined'}
              onClick={() => handleAmountSelection(5)}
            >
              $5
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedAmount === 10 ? 'contained' : 'outlined'}
              onClick={() => handleAmountSelection(10)}
            >
              $10
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedAmount === 50 ? 'contained' : 'outlined'}
              onClick={() => handleAmountSelection(50)}
            >
              $50
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={selectedAmount === 100 ? 'contained' : 'outlined'}
              onClick={() => handleAmountSelection(100)}
            >
              $100
            </Button>
          </Grid>
        </Grid>

        {/* Custom Amount Input */}
        <TextField
          fullWidth
          label="Custom Amount"
          type="number"
          value={customAmount}
          onChange={handleCustomAmountChange}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />

        {/* Donate Button */}
        <Box sx={{ marginTop: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleDonate}
            size="large"
          >
            Donate Now
          </Button>
        </Box>
      </Paper>

      {/* Thank You Message */}
      <Snackbar
        open={donationSuccess}
        autoHideDuration={10000}
        onClose={() => setDonationSuccess(false)}
      >
        <Alert
          onClose={() => setDonationSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you for your donation!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Donations;