import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Spinner,
  ModalFooter,
  Accordion,
  AccordionItem,
  AccordionButton,
  HStack,
  AccordionIcon,
  AccordionPanel,
  Text,
  Tag,
} from '@chakra-ui/react'
import { Log } from 'db'
import { useLogs } from 'services/typebots/logs'
import { isDefined } from 'utils'

export const LogsModal = ({
  resultId,
  onClose,
}: {
  resultId?: string
  onClose: () => void
}) => {
  const { isLoading, logs } = useLogs(resultId)
  return (
    <Modal isOpen={isDefined(resultId)} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Logs</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={Stack}>
          {logs?.map((log, idx) => (
            <LogCard key={idx} log={log} />
          ))}
          {isLoading && <Spinner />}
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}

const LogCard = ({ log }: { log: Log }) => {
  if (log.details)
    return (
      <Accordion allowToggle>
        <AccordionItem style={{ borderBottomWidth: 0, borderWidth: 0 }}>
          <AccordionButton
            as={HStack}
            p="4"
            cursor="pointer"
            justifyContent="space-between"
            borderRadius="md"
          >
            <HStack>
              <StatusTag status={log.status} />
              <Text>{log.description}</Text>
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            as="pre"
            overflow="scroll"
            borderWidth="1px"
            borderRadius="md"
          >
            {log.details}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  return (
    <HStack p="4">
      <StatusTag status={log.status} />
      <Text>{log.description}</Text>
    </HStack>
  )
}

const StatusTag = ({ status }: { status: string }) => {
  switch (status) {
    case 'error':
      return <Tag colorScheme={'red'}>Fail</Tag>
    case 'warning':
      return <Tag colorScheme={'orange'}>Warn</Tag>
    case 'info':
      return <Tag colorScheme={'blue'}>Info</Tag>
    default:
      return <Tag colorScheme={'green'}>Ok</Tag>
  }
}
