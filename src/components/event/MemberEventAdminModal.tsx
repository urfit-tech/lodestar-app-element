import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react'
import moment, { Moment } from 'moment'
import { curry, filter, map, pipe } from 'ramda'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Frequency, Options, RRule, Weekday, WeekdayStr } from 'rrule'
import useSWRMutation from 'swr/mutation'
import { FetchButton } from '../../components/buttons/FetchButton'
import { commonMessages } from '../../helpers/translation'
import {
  EventRequest,
  GeneralModalDefaultEventForEditMode,
  isModalDefaultEventForBasicModeWithSource,
  isModalDefaultEventForEditMode,
  isModalDefaultEventForEditModeAndRecurring,
  ModalDefaultEventForBasicMode,
  ModalDefaultEventForBasicModeWithSource,
  ModalDefaultEventForEditMode,
  Resource,
} from '../../types/event'

const MemberEventAdminModal: React.FC<{
  memberId: string
  membersAsResources: Array<Resource>
  isOpen: boolean
  onClose: () => void
  focusedEvent:
    | ModalDefaultEventForBasicMode
    | ModalDefaultEventForBasicModeWithSource
    | GeneralModalDefaultEventForEditMode
  isRruleOptional: boolean
  refetchResourceEvents: () => void
  createResourceEventFetcher: (payload: { events: Array<EventRequest>; invitedResource: Array<any> }) => any
  updateResourceEventFetcher: (payload: EventRequest) => (event_id: string) => any
  deleteResourceEventFetcher: (deletedAt: Date) => (event_id: string) => any
}> = ({
  memberId,
  membersAsResources,
  isOpen,
  onClose,
  isRruleOptional,
  focusedEvent,
  refetchResourceEvents,
  createResourceEventFetcher,
  updateResourceEventFetcher,
  deleteResourceEventFetcher,
}) => {
  const { formatMessage } = useIntl()
  const [isRrulePanelOpen, setIsRrulePanelOpen] = useState(!isRruleOptional)

  const toggleRrulePanel = () => {
    setIsRrulePanelOpen(!isRruleOptional || !isRrulePanelOpen)
  }

  const generateDefaultEventValue = curry(
    <K extends keyof ModalDefaultEventForEditMode>(
      key: K,
      value: ModalDefaultEventForEditMode[K],
    ): ModalDefaultEventForEditMode[K] => (isModalDefaultEventForEditMode(focusedEvent) ? focusedEvent?.[key] : value),
  )

  const generateDefaultRecurringEventValue = curry(
    <K extends keyof Options>(key: K, value: Partial<Options>[K]): Partial<Options>[K] | undefined =>
      isModalDefaultEventForEditModeAndRecurring(focusedEvent)
        ? focusedEvent.rrule?.origOptions?.[key]
        : isRrulePanelOpen
        ? value
        : undefined,
  )
  console.log(focusedEvent)

  const [startTime, setStartTime] = useState(focusedEvent.started_at)
  const [endTime, setEndTime] = useState(focusedEvent.ended_at)
  const [title, setTitle] = useState(generateDefaultEventValue('title')('') as string)
  const [description, setDescription] = useState(generateDefaultEventValue('description')('') as string)
  const [eventMetadata, setEventMetadata] = useState(generateDefaultEventValue('event_metadata')({}) as object)
  const [publishedAt, setPublishedAt] = useState(generateDefaultEventValue('published_at')('') as Moment)

  const [sourceType, setSourceType] = useState(
    isModalDefaultEventForBasicModeWithSource(focusedEvent) ? focusedEvent.source_type : undefined,
  )
  const [sourceTarget, setSourceTarget] = useState(
    isModalDefaultEventForBasicModeWithSource(focusedEvent) ? focusedEvent.source_target : undefined,
  )

  const [rruleFreq, setRruleFreq] = useState(
    generateDefaultRecurringEventValue('freq')(RRule.WEEKLY) as Frequency | undefined,
  )
  const [until, setUntil] = useState(
    generateDefaultRecurringEventValue('until')(focusedEvent.ended_at.toDate()) as Date,
  )
  const [byweekday, setByweekday] = useState(
    generateDefaultRecurringEventValue('byweekday')([momentToWeekday(startTime)]) as Array<Weekday> | undefined,
  )

  const [role, setRole] = useState(generateDefaultEventValue('role')('') as string)

  const changeEventStartTime = (targetStartTime: Moment) => {
    if (targetStartTime < endTime) {
      setStartTime(targetStartTime)
      setByweekday([momentToWeekday(targetStartTime)])
      setEndTime(targetStartTime)
    }
  }

  const changeEventEndTime = (targetEndDate: Moment) => {
    if (targetEndDate > startTime) {
      setEndTime(targetEndDate)
    }
  }

  function momentToWeekday(moment: Moment): Weekday {
    const weekdayKey = moment.clone().locale('en').format('dd').toUpperCase() as WeekdayStr
    return RRule[weekdayKey]
  }

  const isInByweekday = (targetWeekday: Weekday) =>
    byweekday?.filter((weekday: Weekday) => weekday.equals(targetWeekday)).length !== 0

  const switchWeekDay = (targetWeekday: Weekday) => {
    if (!targetWeekday.equals(momentToWeekday(startTime))) {
      setByweekday(
        isInByweekday(targetWeekday)
          ? byweekday?.filter((weekday: Weekday) => !weekday.equals(targetWeekday))
          : byweekday?.concat(targetWeekday),
      )
    }
  }

  const formatLocalDateTime = (moment: Moment | undefined) => moment?.format?.('YYYY-MM-DD HH:mm:ss')

  const rrule = new RRule({
    dtstart: startTime.clone().utc(true).toDate(),
    freq: rruleFreq,
    byweekday,
    until: until,
    tzid: 'Asia/Taipei',
  })

  const eventPayload = {
    ...{
      title,
      description,
      started_at: startTime.toDate(),
      ended_at: endTime.toDate(),
      source_type: sourceType,
      source_target: sourceTarget,
      metadata: eventMetadata,
      published_at: publishedAt?.toDate?.(),
    },
    ...(rrule
      ? {
          rrule: rrule.toString(),
          until: until,
        }
      : {}),
  }

  const invitedResource = pipe(
    filter((resource: Resource) => resource.target === memberId),
    map((resource: Resource) => ({
      temporally_exclusive_resource_id: resource.id,
    })),
  )(membersAsResources)

  const { trigger: createEventAndInviteResource } = useSWRMutation(
    [eventPayload, invitedResource],
    ([eventPayload, invitedResource]) => createResourceEventFetcher({ events: [eventPayload], invitedResource } as any),
  )

  const { trigger: updateEvent } = useSWRMutation(
    [eventPayload as EventRequest, (focusedEvent as GeneralModalDefaultEventForEditMode).event_id],
    ([eventPayload, focusedEventId]) => updateResourceEventFetcher(eventPayload)(focusedEventId),
  )

  const { trigger: deleteEvent } = useSWRMutation(
    [new Date(), (focusedEvent as GeneralModalDefaultEventForEditMode).event_id],
    ([deletedAt, focusedEventId]) => deleteResourceEventFetcher(deletedAt)(focusedEventId),
  )

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{memberId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Title
          <Input size="md" type="text" value={title} onChange={e => setTitle(e.target.value)} />
          Description
          <Textarea size="md" value={description} onChange={e => setDescription(e.target.value)} />
          From
          <Input
            size="md"
            type="datetime-local"
            value={formatLocalDateTime(startTime)}
            onChange={e => changeEventStartTime(moment(e.target.value))}
          />
          To
          <Input
            size="md"
            type="datetime-local"
            value={formatLocalDateTime(endTime)}
            onChange={e => changeEventEndTime(moment(e.target.value))}
          />
          <Accordion
            defaultIndex={isRruleOptional ? undefined : [0]}
            index={isRrulePanelOpen ? [0] : undefined}
            onClick={toggleRrulePanel}
          >
            <AccordionItem>
              <AccordionButton>
                <Box as="span" textAlign="left">
                  <Checkbox isChecked={isRrulePanelOpen} onClick={toggleRrulePanel} /> Rrule
                </Box>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <ButtonGroup gap="4">
                  {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(id => {
                    const weekday = RRule[id as WeekdayStr]
                    return (
                      <Button
                        colorScheme={isInByweekday(weekday) ? 'blue' : 'gray'}
                        id={id}
                        key={id}
                        height="2.4em"
                        width="2.4em"
                        borderRadius="1.2em"
                        onClick={() => switchWeekDay(weekday)}
                      >
                        {id}
                      </Button>
                    )
                  })}
                </ButtonGroup>
                <p>Until</p>
                <Input
                  value={formatLocalDateTime(moment(until).utc(false))}
                  size="md"
                  type="datetime-local"
                  onChange={e => setUntil(moment(e.target.value).utc(true).toDate())}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>

        <ModalFooter>
          <FetchButton
            fetcher={isModalDefaultEventForEditMode(focusedEvent) ? updateEvent : createEventAndInviteResource}
            afterFetch={() => {
              onClose()
              refetchResourceEvents()
            }}
            colorScheme={'blue'}
          >
            {isModalDefaultEventForEditMode(focusedEvent)
              ? formatMessage(commonMessages.ui.modify)
              : formatMessage(commonMessages.ui.add)}
          </FetchButton>
          {isModalDefaultEventForEditMode(focusedEvent) ? (
            <FetchButton
              fetcher={deleteEvent}
              afterFetch={() => {
                onClose()
                refetchResourceEvents()
              }}
              colorScheme={'red'}
            >
              {formatMessage(commonMessages.ui.delete)}
            </FetchButton>
          ) : (
            <></>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MemberEventAdminModal
