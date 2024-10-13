import React from 'react';
import { useState, useEffect } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Textarea,
  Group,
  Anchor,
  Box,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ModalsProvider, modals } from '@mantine/modals';

const CharacterForm = ({ pagesInitVal, onSubmit, title, btnLabel }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    initialValues: {
      pagesInitVal,
    },
  });

  const openModal = (onConfirm) =>
    modals.openConfirmModal({
      title: title,
      centered: true,
      children: (
        <Box>
          <p>Are you sure to {title}?</p>
        </Box>
      ),
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: async () => {
        try {
          await onConfirm();
          window.location.replace('/cartoonpia');
        } catch (err) {
          setErrorMessage('Failed to process request.');
          console.log(err);
        }
      },
    });

  const submitHandler = (values) => {
    openModal(() => onSubmit(values));
  };

  const resetHandler = () => {
    form.setValues(pagesInitVal);
  };

  useEffect(() => {
    form.setValues(pagesInitVal);
  }, [pagesInitVal]);

  return (
    <ModalsProvider>
      <div>
        <h1>{title}</h1>
        <form onSubmit={form.onSubmit(submitHandler)}>
          <section>
            {errorMessage && (
              <Text color="red">
                Error to process request, please try it again.
              </Text>
            )}

            <TextInput required label="Name" {...form.getInputProps('name')} />
            <TextInput
              required
              label="Subtitle"
              {...form.getInputProps('subtitle')}
            />
            {title === 'Create Character' ? (
              <Textarea
                required
                label="Description"
                {...form.getInputProps('description')}
              />
            ) : (
              <Textarea
                label="Description"
                {...form.getInputProps('description')}
              />
            )}
            <NumberInput
              required
              min={0}
              max={100}
              label="Strength"
              {...form.getInputProps('strength')}
            />
            <NumberInput
              required
              min={0}
              max={100}
              label="Speed"
              {...form.getInputProps('speed')}
            />
            <NumberInput
              required
              min={0}
              max={100}
              label="Skill"
              {...form.getInputProps('skill')}
            />
            <NumberInput
              required
              min={0}
              max={100}
              label="Fear Factor"
              {...form.getInputProps('fear_factor')}
            />
            <NumberInput
              required
              min={0}
              max={100}
              label="Power"
              {...form.getInputProps('power')}
            />
            <NumberInput
              required
              min={0}
              max={100}
              label="Intelligence"
              {...form.getInputProps('intelligence')}
            />
            <NumberInput
              required
              min={0}
              max={100}
              label="Wealth"
              {...form.getInputProps('wealth')}
            />
          </section>

          <Group justify="center">
            <Button type="submit">{btnLabel}</Button>
            <Anchor href="/cartoonpia">
              <Button variant="default">Cancel</Button>
            </Anchor>
            <Anchor underline="hover" onClick={resetHandler}>
              Reset
            </Anchor>
          </Group>
        </form>
      </div>
    </ModalsProvider>
  );
};

export default CharacterForm;
