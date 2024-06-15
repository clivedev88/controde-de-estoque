import { isAuthenticated } from './auth.js';

if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.getElementById('generate-report');
    const daysFilter = document.getElementById('days-filter');

    generateReportButton.addEventListener('click', () => {
        const days = parseInt(daysFilter.value, 10);
        generateReport(days);
    });

    const generateReport = (days) => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const reportData = products.filter(product => {
            const expiryDate = new Date(product.expiry);
            return expiryDate <= futureDate && expiryDate >= new Date(today);
        });

        const reportHtml = generateReportHtml(reportData, days);
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(reportHtml);
        reportWindow.document.close();
    };

    const generateReportHtml = (reportData, days) => {
        let html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Relatório de Produtos</title>
            <link rel="stylesheet" href="css/tables.css">
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    text-align: center;
                }
                table {
                    width: 100%;
                    margin: 20px 0;
                    border-collapse: collapse;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                table th, table td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                table th {
                    background-color: #f4f4f4;
                }
                table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                table tr:hover {
                    background-color: #f1f1f1;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Relatório de Produtos Próximos da Validade</h1>
                <p>Produtos que vencem nos próximos ${days} dias.</p>
                <table>
                    <thead>
                        <tr>
                            <th>Nome do Produto</th>
                            <th>Categoria</th>
                            <th>Data de Validade</th>
                            <th>Quantidade</th>
                            <th>Lote</th>
                            <th>Fornecedor</th>
                        </tr>
                    </thead>
                    <tbody>`;

        if (reportData.length > 0) {
            reportData.forEach(product => {
                html += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.expiry}</td>
                    <td>${product.quantity}</td>
                    <td>${product.batch}</td>
                    <td>${product.supplier}</td>
                </tr>`;
            });
        } else {
            html += `
                <tr>
                    <td colspan="6">Nenhum produto próximo da validade nos próximos ${days} dias.</td>
                </tr>`;
        }

        html += `
                    </tbody>
                </table>
            </div>
        </body>
        </html>`;
        return html;
    };
});
