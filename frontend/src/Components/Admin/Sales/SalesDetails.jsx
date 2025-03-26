import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from "jspdf";
import "jspdf-autotable";

const SalesDetails = () => {
    const { saleId } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/sales/${saleId}`)
            .then(res => {
                setSale(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching sale details:', err);
                setError('Failed to load sale details');
                setLoading(false);
            });
    }, [saleId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!sale) return <p>No sale found</p>;

    return (
        <div className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Sale Details</h2>
            <p><strong>Vehicle ID:</strong> {sale.vehicleId}</p>
            <p><strong>Customer ID:</strong> {sale.customerId}</p>
            <p><strong>Rental Period:</strong> {sale.rentalPeriod} days</p>
            <p><strong>Total Amount:</strong> ${sale.totalAmount}</p>
            <p><strong>Payment Status:</strong> {sale.paymentStatus}</p>
        </div>
    );
};

export default SalesDetails;
