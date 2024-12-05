import React from "react";
import { Dialog, YStack, XStack, Button, SizableText, Text } from "tamagui";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => (
  <>
    {isOpen && (
      <Dialog onOpenChange={onClose}>
        <Dialog.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          opacity={0.8}
          backgroundColor="rgba(0, 0, 0, 0)"
        />
        <Dialog.Content
          elevate
          bordered
          borderRadius={16}
          backgroundColor="white"
          padding={20}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
              scale: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <YStack alignItems="center" gap={15}>
            <SizableText size={20} fontWeight="bold" color="black">
              Confirm Deletion
            </SizableText>
            <Text fontSize={16} color="gray">
              Are you sure you want to delete this? This action cannot be
              undone.
            </Text>
            <XStack
              gap={10}
              alignItems="center"
              justifyContent="space-between"
              width={"100%"}
            >
              <YStack>
                <Button size={40} onPress={onClose}>
                  <Text>Cancel</Text>
                </Button>
              </YStack>
              <YStack>
                <Button
                  size={40}
                  style={{ background: "#b32d00" }}
                  onPress={onConfirm}
                >
                  <Text color={"white"}>Delete</Text>
                </Button>
              </YStack>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog>
    )}
  </>
);

export default DeleteModal;
