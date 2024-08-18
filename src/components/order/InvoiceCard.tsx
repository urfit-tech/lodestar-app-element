import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../contexts/AppContext'
import orderMessages from './translations'

const StyledCard = styled.div`
  padding: 16px;
  border-radius: 4px;
  border: solid 1px #ececec;
`

const StyledInfoTitle = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.2px;
  width: 35%;
`
const StyledInfoMessage = styled.div`
  width: 65%;
`

const InvoiceCard: React.FC<{
  status: string
  invoiceIssuedAt: string
  invoiceNumber: string
  invoiceName: string
  invoicePhone: string
  invoiceEmail: string
  invoiceTarget: string
  donationCode: string
  invoiceCarrier: string
  uniformNumber: string
  uniformTitle: string
  invoiceAddress: string
}> = ({
  status,
  invoiceIssuedAt,
  invoiceNumber,
  invoiceName,
  invoicePhone,
  invoiceEmail,
  invoiceTarget,
  donationCode,
  invoiceCarrier,
  uniformNumber,
  uniformTitle,
  invoiceAddress,
}) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()

  const statusMessage = !status
    ? formatMessage(orderMessages.InvoiceCard.invoicePending)
    : status === 'SUCCESS'
    ? formatMessage(orderMessages.InvoiceCard.invoiceSuccess)
    : formatMessage(orderMessages.InvoiceCard.invoiceFailed, { errorCode: status })
  const contentList = [
    { title: formatMessage(orderMessages.InvoiceCard.invoiceStatus), message: statusMessage, isRender: true },
    {
      title: formatMessage(orderMessages.InvoiceCard.invoiceNumber),
      message: invoiceNumber,
      isRender: enabledModules.invoice,
    },
    {
      title: formatMessage(orderMessages.InvoiceCard.invoiceIssuedAt),
      message: invoiceIssuedAt,
      isRender: enabledModules.invoice,
    },
    { title: formatMessage(orderMessages.InvoiceCard.invoiceName), message: invoiceName, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.invoicePhone), message: invoicePhone, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.invoiceEmail), message: invoiceEmail, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.invoiceTarget), message: invoiceTarget, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.donationCode), message: donationCode, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.invoiceCarrier), message: invoiceCarrier, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.uniformNumber), message: uniformNumber, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.uniformTitle), message: uniformTitle, isRender: true },
    { title: formatMessage(orderMessages.InvoiceCard.invoiceAddress), message: invoiceAddress, isRender: true },
  ]
  return (
    <StyledCard>
      <div className="container">
        {contentList.map(
          (row, idx) =>
            row.isRender && (
              <div className="row mb-2 justify-content-between" key={idx}>
                <StyledInfoTitle className="column">{row.title}</StyledInfoTitle>
                <StyledInfoMessage className="column">{row.message}</StyledInfoMessage>
              </div>
            ),
        )}
      </div>
    </StyledCard>
  )
}

export default InvoiceCard
