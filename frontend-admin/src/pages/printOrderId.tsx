import { useEffect, useState } from 'react';
import { Accordion, Alert, Spinner } from 'react-bootstrap';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import OrderTable from '../components/orderTable/orderTable';
import { RootState } from '../store';
import Order from '../types/order';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PrintOrderId = () => {
    const navigate = useNavigate();
    const logged = useSelector((state: RootState) => state.login);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState({ status: false, message: '' });
    const [fetchedOrder, setFetchedOrder] = useState<Order>();
    const params = useParams<{ orderId: string }>();
    const fetchOrder = async () => {
        let dataFetched: { message: string; order: Order };
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + '/fetch-order',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        order: { id: +params.orderId! },
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            dataFetched = (await response.json()) as {
                message: string;
                order: Order;
            };
            if (!response.ok) {
                throw new Error(dataFetched.message);
            }
            setFetchedOrder(dataFetched.order);
        } catch (error) {
            setIsError({ status: true, message: dataFetched!.message });
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setIsError({ status: false, message: '' });
        fetchOrder();
    }, [params.orderId]);

    if (!logged.logged) {
        navigate('/order', { replace: true });
        return <></>;
    }
    const printingLogic = () => {
        const fontSizeHeader = 13;
        const fontSizeBody = 11;

        var docDefinition = {
            content: [
                {
                    text: 'Festa di communità San Lorenzo',
                    style: { bold: true, alignment: 'center' },
                },
                {
                    text: new Date().toLocaleString('en-GB').toString(),
                    style: { fontSize: 9, alignment: 'center' },
                },
                {
                    style: 'tableExample',

                    table: {
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [
                                'Nome: ' + fetchedOrder!.name,
                                'N. Tavolo: ___________',
                                'N. Persone: ' + fetchedOrder!.numberOfPeople,
                                'n.: ' + fetchedOrder!.id,
                            ],
                        ],
                    },
                },
                fetchedOrder &&
                fetchedOrder.OrderFood &&
                fetchedOrder.OrderFood.length > 0
                    ? {
                          style: 'tableExample',
                          table: {
                              widths: [39, 150, 11, 40, 47, '*'],
                              body: [
                                  [
                                      {
                                          text: 'Categoria',
                                          style: {
                                              fontSize: fontSizeHeader - 4,
                                          },
                                      },
                                      {
                                          text: 'Nome',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'N',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'Prezzo',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'Importo',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'Descrizione',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                  ],
                                  ...fetchedOrder!.OrderFood.filter(
                                      (food) => food.category === '1'
                                  ).map((food) => [
                                      {
                                          text: 'primo',
                                          style: { fontSize: fontSizeBody - 2 },
                                      },
                                      {
                                          text: food.name,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.quantity,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.price.toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text:
                                              (
                                                  food.price * food.quantity
                                              ).toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.description,
                                          style: { fontSize: fontSizeBody },
                                      },
                                  ]),
                                  ...fetchedOrder!.OrderFood.filter(
                                      (food) => food.category === '2'
                                  ).map((food) => [
                                      {
                                          text: 'secondo',
                                          style: { fontSize: fontSizeBody - 2 },
                                      },
                                      {
                                          text: food.name,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.quantity,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.price.toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text:
                                              (
                                                  food.price * food.quantity
                                              ).toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.description,
                                          style: { fontSize: fontSizeBody },
                                      },
                                  ]),
                                  ...fetchedOrder!.OrderFood.filter(
                                      (food) => food.category === '3'
                                  ).map((food) => [
                                      {
                                          text: 'contorno',
                                          style: { fontSize: fontSizeBody - 2 },
                                      },
                                      {
                                          text: food.name,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.quantity,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.price.toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text:
                                              (
                                                  food.price * food.quantity
                                              ).toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: food.description,
                                          style: { fontSize: fontSizeBody },
                                      },
                                  ]),
                              ],
                          },
                      }
                    : 'Nessun Cibo.',
                {
                    style: 'tableExample',
                    absolutePosition: { x: 40, y: 560 },
                    table: {
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [
                                'Nome: ' + fetchedOrder!.name,
                                'N. Tavolo: ___________',
                                'N. Persone: ' + fetchedOrder!.numberOfPeople,
                                'n.: ' + fetchedOrder!.id,
                            ],
                        ],
                    },
                },
                fetchedOrder &&
                fetchedOrder.OrderLiquid &&
                fetchedOrder.OrderLiquid.length > 0
                    ? {
                          style: 'tableExample',
                          absolutePosition: { x: 40, y: 580 },
                          table: {
                              widths: [150, 11, 40, 47, '*'],
                              body: [
                                  [
                                      {
                                          text: 'Nome',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'N',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'Prezzo',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'Importo',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                      {
                                          text: 'Descrizione',
                                          style: { fontSize: fontSizeHeader },
                                      },
                                  ],
                                  ...fetchedOrder.OrderLiquid.map((liquid) => [
                                      {
                                          text: liquid.name,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: liquid.quantity,
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: liquid.price.toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text:
                                              (
                                                  liquid.price * liquid.quantity
                                              ).toFixed(2) + ' €',
                                          style: { fontSize: fontSizeBody },
                                      },
                                      {
                                          text: liquid.description,
                                          style: { fontSize: fontSizeBody },
                                      },
                                  ]),
                              ],
                          },
                      }
                    : 'Nessuna bevanda.',
                {
                    style: 'tableExample',
                    absolutePosition: { x: 445, y: 781 },
                    table: {
                        widths: [100],
                        body: [
                            [
                                {
                                    text:
                                        'Totale: ' +
                                        fetchedOrder!.totalPrice.toFixed(2) +
                                        ' €',
                                    style: { bold: true },
                                },
                            ],
                        ],
                    },
                },
            ],
        };
        pdfMake.createPdf(docDefinition as any).download();
    };

    return (
        <>
            {isError.status && !isLoading && (
                <Alert variant="warning">{isError.message}</Alert>
            )}
            {!isError.status && isLoading && (
                <Spinner animation="border" role="status" />
            )}
            {!isError.status && !isLoading && !fetchedOrder && (
                <Alert variant="warning">Ordine non trovato.</Alert>
            )}
            {!isError.status && !isLoading && fetchedOrder && (
                <OrderTable
                    description={fetchedOrder.description}
                    food={fetchedOrder.OrderFood}
                    liquids={fetchedOrder.OrderLiquid}
                    name={fetchedOrder.name}
                    surname={fetchedOrder.surname}
                    numberOfPeople={fetchedOrder.numberOfPeople}
                    status={fetchedOrder.status}
                    totalPrice={fetchedOrder.totalPrice}
                    orderId={fetchedOrder.id}
                    token={logged.token}
                    buttonName="Stampa"
                    isLoading={isLoading}
                    onClick={printingLogic}
                />
            )}
        </>
    );
};
export default PrintOrderId;
