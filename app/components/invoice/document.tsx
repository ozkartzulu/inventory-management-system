
import { customer, supplier } from '@prisma/client';
import {Document, Page, Text, View, Image, PDFViewer} from '@react-pdf/renderer';
import { capitalizeWords, formatDate } from '~/utils/utils';

type InvoiceType = {
    products: {id: number, name: string, url: string, quantity: number, price: string}[] | undefined, 
    customer?: customer | null, 
    supplier?: supplier | null, 
    invoice: {id: number, date: string, total: number, debt: number, userId: number, customerId?: number, supplierId?: number} | null, 
    user: {id: number, firstName: string, lastName: string, email: string} | null,
    type: string
}

function Documento({ products, customer, supplier, invoice, user, type }: InvoiceType){

    const getNameClient = () => {
        if(type === 'sell' && customer) {
            return capitalizeWords(customer.name);
        } else if(type === 'buy' && supplier) {
            return capitalizeWords(supplier.name);
        }
        return '';
    }

    return (
        <Document>
        <Page size='LETTER' orientation='landscape' style={{ padding: "20px 0"}}>
        <View style={{margin: "10px 12px"}}>
            <Text style={{marginBottom: "15px", fontSize: "16px", textAlign: "center"}}>Lubricantes Rojas</Text>
            <Text style={{marginBottom: "6px", fontSize: "10px"}}>Fecha: {formatDate(invoice?.date+'')}</Text>
            <Text style={{marginBottom: "6px", fontSize: "10px"}}>Cliente: { getNameClient()}</Text>
            <Text style={{marginBottom: "10px", fontSize: "10px"}}>Vendedor: { user ? capitalizeWords(user.firstName+' '+ user?.lastName) : '' }</Text>
            <View >
                <View style={{}}>
                    <View style={{backgroundColor: "#E5E7EB", border: "1px solid #9CA3AF"}}>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}>Código</Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}>Cantidad</Text>
                            <Text style={{padding: "4px 6px", width: "35%", fontSize: "9px"}}>Nombre</Text>
                            <Text style={{padding: "4px 6px", width: "20%", fontSize: "9px"}}>Precio Unitario</Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}>Subtotal</Text>
                        </View>
                    </View>
                    <View style={{borderLeft: "1px solid #9CA3AF", borderRight: "1px solid #9CA3AF"}}>
                        { products?.map( (row, index) => (
                            <View key={index} style={{ display: "flex", flexDirection: "row", borderBottom: "1px solid #9CA3AF" }}>
                                <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}>{invoice?.id}</Text>
                                <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}>{row.quantity}</Text>
                                <Text style={{padding: "4px 6px", width: "35%", fontSize: "9px"}}>{row.name}</Text>
                                <Text style={{padding: "4px 6px", width: "20%", fontSize: "9px"}}>{ row.price } Bs.</Text>
                                <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}>{ row.quantity * +row.price } Bs.</Text>
                            </View>
                        ) ) }
                    </View>
                </View>
                <View>
                    <View style={{}}>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "35%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "20%", fontSize: "9px", backgroundColor: "#E5E7EB", borderBottom: "1px solid #9CA3AF", borderLeft: "1px solid #9CA3AF"}}>Subtotal</Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px", backgroundColor: "#E5E7EB", borderBottom: "1px solid #9CA3AF", borderRight: "1px solid #9CA3AF"}}>{invoice?.total} Bs.</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={{}}>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "35%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "20%", fontSize: "9px", backgroundColor: "#E5E7EB", borderBottom: "1px solid #9CA3AF", borderLeft: "1px solid #9CA3AF"}}>Deuda</Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px", backgroundColor: "#E5E7EB", borderBottom: "1px solid #9CA3AF", borderRight: "1px solid #9CA3AF"}}>{invoice?.debt} Bs.</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={{}}>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "35%", fontSize: "9px"}}></Text>
                            <Text style={{padding: "4px 6px", width: "20%", fontSize: "9px", backgroundColor: "#E5E7EB", borderBottom: "1px solid #9CA3AF", borderLeft: "1px solid #9CA3AF"}}>Total</Text>
                            <Text style={{padding: "4px 6px", width: "15%", fontSize: "9px", backgroundColor: "#E5E7EB", borderBottom: "1px solid #9CA3AF", borderRight: "1px solid #9CA3AF"}}>{ invoice ? invoice.total - invoice.debt : 0} Bs.</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        </Page>
        </Document>
    )
}

export default Documento