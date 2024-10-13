import { useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { useMemo } from 'react';
import { allCharacterInfo } from '../../features/user/api';
import makePage from '../../components/makePage';
import Link from 'next/link';

import {
  Table,
  Grid,
  RangeSlider,
  Checkbox,
  TextInput,
  Anchor,
  Button,
} from '@mantine/core';

const Cartoonpia = () => {
  const [characterData, setCharacterData] = useState(null);
  useEffect(() => {
    allCharacterInfo().then((data) => setCharacterData(data));
  }, []);

  const [selectedCharcter, setSelectedCharacter] = useState([]);
  const [selectedCharcterHistory, setSelectedCharacterHistory] = useState([]);
  const [searchBarFilter, setSearchBarFilter] = useState('');

  // initialise using local storage for persistance
  const [comparisonHistory, setComparisonHistory] = useState(() => {
    const storedHistory = localStorage.getItem("comparisonHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  // set maximum comparisons
  const MAX_COMPARISONS = 5;

  const form = useForm({
    initialValues: {
      strength: [20, 80],
      speed: [20, 80],
      skill: [20, 80],
      fearFactor: [20, 80],
      power: [20, 80],
      intelligence: [20, 80],
      wealth: [20, 80],
    },
  });

  const tableContent = useMemo(() => {
    const filter = form.getValues();
    if (!characterData) {
      return [];
    }

    let filteredData = characterData.filter((val) => {
      return (
        val.strength >= filter.strength[0] &&
        val.strength <= filter.strength[1] &&
        val.speed >= filter.speed[0] &&
        val.speed <= filter.speed[1] &&
        val.skill >= filter.skill[0] &&
        val.skill <= filter.skill[1] &&
        val.fear_factor >= filter.fearFactor[0] &&
        val.fear_factor <= filter.fearFactor[1] &&
        val.power >= filter.power[0] &&
        val.power <= filter.power[1] &&
        val.intelligence >= filter.intelligence[0] &&
        val.intelligence <= filter.intelligence[1] &&
        val.wealth >= filter.wealth[0] &&
        val.wealth <= filter.wealth[1]
      );
    });
    if (searchBarFilter !== '')
      filteredData = filteredData.filter(
        (val) =>
          val.name.toLowerCase().search(searchBarFilter.toLowerCase()) >= 0
      );
    return filteredData;
  }, [characterData, form, searchBarFilter]);

  useEffect(() => {
    if (selectedCharcter.length === 2)
      setSelectedCharacterHistory([
        ...selectedCharcterHistory,
        selectedCharcter,
      ]);
  }, [selectedCharcter]);

  // set character comparison history as the character names instead of id
  useEffect(() => {
    if (selectedCharcter.length === 2) {
      const comparison =[
        {
          name: characterData.find((character) => character._id === selectedCharcter[0]).name,
        },
        {
          name: characterData.find((character) => character._id === selectedCharcter[1]).name,
        }
      ];
      setComparisonHistory(prevHistory => {
        const newHistory = [...prevHistory, comparison];
        return newHistory.slice(-MAX_COMPARISONS); // Keeps only the latest max number of comparisons
      });
    }
  }, [selectedCharcter, characterData]);

  // locally store the character comparison history
  useEffect(() => {
    localStorage.setItem("comparisonHistory", JSON.stringify(comparisonHistory));
  }, [comparisonHistory]);

  const selectCharacter = (id, checked) => {
    if (checked) {
      if (selectedCharcter.length === 2) {
        return;
      }
      setSelectedCharacter([...selectedCharcter, id]);
    } else {
      setSelectedCharacter(selectedCharcter.filter((val) => val !== id));
    }
  };

  return (
    <>
      <TextInput
        label="Filter Character"
        placeholder="Enter Character Name"
        onChange={(e) => setSearchBarFilter(e.currentTarget.value)}
      />
      <Grid>
        <Grid.Col span={2}>
          <form>
            Strength
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('strength', e)}
            />
            Speed
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('speed', e)}
            />
            Skill
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('skill', e)}
            />
            Fear Factor
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('fearFactor', e)}
            />
            Power
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('power', e)}
            />
            Intelligence
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('intelligence', e)}
            />
            Wealth
            <RangeSlider
              defaultValue={[20, 80]}
              onChange={(e) => form.setFieldValue('wealth', e)}
            />
          </form>
        </Grid.Col>
        <Grid.Col span={8}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Strength</Table.Th>
                <Table.Th>Speed</Table.Th>
                <Table.Th>Skill</Table.Th>
                <Table.Th>Fear Factor</Table.Th>
                <Table.Th>Power</Table.Th>
                <Table.Th>Intelligence</Table.Th>
                <Table.Th>Wealth</Table.Th>
                <Table.Th>Selected</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableContent.map((val) => {
                return (
                  <>
                    <Table.Tr key={val._id}>
                      <Table.Td>
                        <Anchor href={`/cartoonpia/characters/${val._id}`}>
                          {val.name}
                        </Anchor>
                      </Table.Td>
                      <Table.Td>{val.strength}</Table.Td>
                      <Table.Td>{val.speed}</Table.Td>
                      <Table.Td>{val.skill}</Table.Td>
                      <Table.Td>{val.fear_factor}</Table.Td>
                      <Table.Td>{val.power}</Table.Td>
                      <Table.Td>{val.intelligence}</Table.Td>
                      <Table.Td>{val.wealth}</Table.Td>
                      <Table.Td>
                        <Checkbox
                          onChange={(e) =>
                            selectCharacter(val._id, e.currentTarget.checked)
                          }
                          checked={selectedCharcter.includes(val._id)}
                        />
                      </Table.Td>
                    </Table.Tr>
                  </>
                );
              })}
            </Table.Tbody>
          </Table>
        </Grid.Col>
        <Grid.Col span={2}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Selected History</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {selectedCharcterHistory.map((val) => {
                return (
                  <>
                    <Table.Tr>
                      <Table.Td>
                        {
                          characterData.find(
                            (character) => character._id === val[0]
                          ).name
                        }
                      </Table.Td>
                      <Table.Td>
                        {
                          characterData.find(
                            (character) => character._id === val[1]
                          ).name
                        }
                      </Table.Td>
                    </Table.Tr>
                  </>
                );
              })}
            </Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
      <div>
        <Button
          component={Link}
          style={{ margin: '5px', width: '200px' }}
          href="/characters/create"
          variant="default"
        >
          Create Characters
        </Button>
      </div>
    </>
  );
};

export default makePage('Cartoonopia', ['user', 'admin'], Cartoonpia);
