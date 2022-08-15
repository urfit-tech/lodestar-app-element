import moment from 'moment'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { certificateMessages } from '../../helpers/translation'
import { MemberCertificate } from '../../types/certificate'
import { BraftContent } from '../common/StyledBraftEditor'

const StyledContentBlock = styled.div`
  padding: 2.5rem;
`
const StyledContentBlockHead = styled.div`
  margin-bottom: 1.125rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
`
const StyledTitle = styled.h1`
  margin-bottom: 0.5rem;
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
  line-height: 1.4;
  letter-spacing: 0.77px;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const StyledAbstract = styled.div`
  overflow: hidden;
  color: var(--gray-darker);
  letter-spacing: 0.2px;
  white-space: pre-wrap;
`
const StyledQualification = styled.div`
  font-size: 16px;
  letter-spacing: 0.2px;
  color: #00c7ec;
  margin-bottom: 1rem;
`

export const StyledCode = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.4px;
  white-space: nowrap;
`
export const StyledDate = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: normal;
  white-space: nowrap;
`

const CertificateContentCard: React.VFC<{
  memberCertificate: MemberCertificate
}> = ({ memberCertificate }) => {
  const { certificate } = memberCertificate
  const { formatMessage } = useIntl()

  return (
    <StyledContentBlock>
      <StyledContentBlockHead>
        <StyledCode>
          {formatMessage(certificateMessages.CertificateContent.number, {
            number: memberCertificate.number || certificate.code,
          })}
        </StyledCode>
        <div className="d-flex align-items-center flex-wrap">
          <StyledDate className="mr-3">
            {formatMessage(certificateMessages.CertificateContent.deliveredAt, {
              deliveredAt: moment(memberCertificate.deliveredAt).format('YYYY/MM/DD'),
            })}
          </StyledDate>
          {memberCertificate.expiredAt && (
            <StyledDate>
              {formatMessage(certificateMessages.CertificateContent.expiredTime, {
                expiredTime: moment(memberCertificate.expiredAt).format('YYYY/MM/DD'),
              })}
            </StyledDate>
          )}
        </div>
      </StyledContentBlockHead>
      <StyledTitle>{certificate.title}</StyledTitle>
      <StyledQualification>{`${formatMessage(certificateMessages.CertificateContent.qualification)} : ${
        certificate.qualification
      }`}</StyledQualification>
      <StyledAbstract>
        {certificate.description && <BraftContent>{certificate.description}</BraftContent>}
      </StyledAbstract>
    </StyledContentBlock>
  )
}

export default CertificateContentCard
