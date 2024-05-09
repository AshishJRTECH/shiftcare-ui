import { createTeam, getStaffList } from "@/api/functions/staff.api";
import Iconify from "@/components/Iconify/Iconify";
import { IStaff } from "@/interface/staff.interfaces";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import CustomInput from "@/ui/Inputs/CustomInput";
import StyledPaper from "@/ui/Paper/Paper";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const StyledPage = styled(Box)`
  padding: 20px 10px;
`;

const schema = yup.object().shape({
  teamName: yup.string().required("Please enter team name")
});

function Draggable({
  item,
  container,
  onClickFn
}: {
  item: IStaff;
  container: string;
  onClickFn?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item?.id,
    data: item
  });

  return (
    <Stack
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "5px 10px",
        cursor: isDragging ? "move" : "pointer",
        touchAction: "none",
        border: "1px solid #eee",
        borderRadius: "5px"
        // "&:hover": onClickFn
        //   ? {
        //       backgroundColor: "rgba(24, 119, 242, 0.08)",
        //       borderColor: "transparent"
        //     }
        //   : null
      }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="subtitle2">{item?.name}</Typography>
      <IconButton onMouseDown={onClickFn}>
        <Iconify
          icon={`${
            !container
              ? "ri:draggable"
              : container === "selected_staffs"
              ? "zondicons:minus-solid"
              : "zondicons:add-solid"
          }`}
          style={{
            color: !container
              ? "#333"
              : container === "selected_staffs"
              ? "#FF5630"
              : "#00A76F"
          }}
        />
      </IconButton>
    </Stack>
  );
}

function Droppable({
  id,
  items,
  containerName,
  onClickFn
}: {
  id: string;
  items: IStaff[];
  containerName: string;
  onClickFn: (id: UniqueIdentifier) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      id: id
    }
  });

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {containerName}
      </Typography>
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
        id={id}
      >
        <Box
          ref={setNodeRef}
          sx={{
            flex: 1,
            // backgroundColor: "#eee",
            border: isOver ? "1px dashed #121212" : "1px solid #f0f0f0",
            borderRadius: "5px",
            padding: "10px"
          }}
        >
          <Stack direction="column" justifyContent="flex-start" gap={1}>
            {items.map((_item: IStaff) => (
              <Draggable
                item={_item}
                key={_item.id}
                container={id}
                onClickFn={() => onClickFn(_item.id)}
              />
            ))}
          </Stack>
        </Box>
      </SortableContext>
    </Box>
  );
}

interface TeamStaffList {
  selected_staffs: IStaff[];
  all_staffs: IStaff[];
}

type findItemContainerResponse = {
  container_name: keyof TeamStaffList;
  data: IStaff[];
};

export default function CreateNewTeam() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [staff_list, setStaff_list] = useState<TeamStaffList>({
    selected_staffs: [],
    all_staffs: []
  });
  const [search, setSearch] = useState("");

  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const { data, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      teamName: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTeam,
    onSuccess: router.back
  });

  useEffect(() => {
    if (!isLoading && data) {
      setStaff_list({
        selected_staffs: [],
        all_staffs: data
      });
    }
  }, [isLoading, data]);

  const findItemContainer = (id: UniqueIdentifier) => {
    return staff_list["all_staffs"].some((_item) => _item.id === id)
      ? {
          container_name: "all_staffs" as keyof TeamStaffList,
          data: staff_list["all_staffs"]
        }
      : {
          container_name: "selected_staffs" as keyof TeamStaffList,
          data: staff_list["selected_staffs"]
        };
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // const destination = collisions?.[0];
    // const source = collisions?.[1];
    // setActiveId(null);
    // console.log(event);
    if (active && over && active.id !== over.id) {
      const {
        container_name: activeContainerName,
        data: activeContainer
      }: findItemContainerResponse = findItemContainer(active.id);

      const {
        container_name: overContainerName,
        data: overContainer
      }: findItemContainerResponse = findItemContainer(over.id);

      if (!activeContainer || !overContainer) return;

      const activeItemIndex = activeContainer.findIndex(
        (item) => item.id === active.id
      );
      const overItemIndex = overContainer.findIndex(
        (item) => item.id === over.id
      );

      if (activeContainerName === overContainerName) {
        const newItems = { ...staff_list };
        newItems[activeContainerName] = arrayMove(
          newItems[activeContainerName],
          activeItemIndex,
          overItemIndex
        );
        setStaff_list(newItems);
      } else {
        const newItems = { ...staff_list };
        const [removedItem] = newItems[activeContainerName].splice(
          activeItemIndex,
          1
        );
        newItems[overContainerName].splice(overItemIndex, 0, removedItem);
        setStaff_list(newItems);
      }
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const {
        container_name: activeContainerName,
        data: activeContainer
      }: findItemContainerResponse = findItemContainer(active.id);

      const {
        container_name: overContainerName,
        data: overContainer
      }: findItemContainerResponse = findItemContainer(over.id);

      if (!activeContainer || !overContainer) return;

      const activeItemIndex = activeContainer.findIndex(
        (item) => item.id === active.id
      );
      const overItemIndex = overContainer.findIndex(
        (item) => item.id === over.id
      );

      if (activeContainerName === overContainerName) {
        const newItems = { ...staff_list };
        newItems[activeContainerName] = arrayMove(
          newItems[activeContainerName],
          activeItemIndex,
          overItemIndex
        );
        setStaff_list(newItems);
      } else {
        const newItems = { ...staff_list };
        const [removedItem] = newItems[activeContainerName].splice(
          activeItemIndex,
          1
        );
        newItems[overContainerName].splice(overItemIndex, 0, removedItem);
        setStaff_list(newItems);
      }
    } else {
      // console.log(event);
    }
  };

  const handleAddItem = (id: UniqueIdentifier) => {
    const activeItemIndex = staff_list.all_staffs.findIndex(
      (_item: IStaff) => _item.id === id
    );
    const newItems = { ...staff_list };
    const [removedItem] = newItems.all_staffs.splice(activeItemIndex, 1);
    newItems.selected_staffs.push(removedItem);
    setStaff_list(newItems);
  };

  const handleRemoveItem = (id: UniqueIdentifier) => {
    const activeItemIndex = staff_list.selected_staffs.findIndex(
      (_item: IStaff) => _item.id === id
    );
    const newItems = { ...staff_list };
    const [removedItem] = newItems.selected_staffs.splice(activeItemIndex, 1);
    newItems.all_staffs.push(removedItem);
    setStaff_list(newItems);
  };

  const onSubmit = (data: { teamName: string }) => {
    if (staff_list.selected_staffs.length === 0) {
      return toast.error("Please select atleast one staff!");
    }
    mutate({
      ...data,
      employeeIds: staff_list.selected_staffs.map((_staff) => _staff.id)
    });
  };

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledPage>
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          justifyContent="space-between"
          gap={2}
          sx={{ marginBottom: "40px" }}
        >
          <Typography variant="h4">Create New Team</Typography>
        </Stack>
        <StyledPaper>
          <FormProvider {...methods}>
            <Grid container spacing={4}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <CustomInput
                  name="teamName"
                  label="Team Name"
                  size="small"
                  placeholder="Name..."
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <CustomInput
                  name=""
                  label="Search Staff"
                  size="small"
                  placeholder="Eg: Staff Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Divider />
              </Grid>
              <DndContext
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                // onDragEnd={handleDragEnd}
                // onDragOver={handleDragEnd}
                sensors={sensors}
                collisionDetection={closestCorners}
              >
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  sx={{ display: "flex" }}
                >
                  <Droppable
                    id="selected_staffs"
                    items={staff_list.selected_staffs}
                    containerName="Selected Staffs"
                    onClickFn={handleRemoveItem}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  sx={{ display: "flex" }}
                >
                  <Droppable
                    id="all_staffs"
                    items={staff_list.all_staffs.filter((_staff) =>
                      _staff.name.toLowerCase().includes(search.toLowerCase())
                    )}
                    containerName={
                      search
                        ? `${
                            staff_list.all_staffs.filter((_staff) =>
                              _staff.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            ).length
                          } Staff Found`
                        : "All Staffs"
                    }
                    onClickFn={handleAddItem}
                  />
                </Grid>
                <DragOverlay>
                  {activeId ? (
                    <Draggable
                      item={data.find((_data: IStaff) => _data.id === activeId)}
                      container=""
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </Grid>
          </FormProvider>
          <Divider sx={{ marginBlock: 2 }} />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
          >
            <Button variant="outlined" size="large" onClick={router.back}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              size="large"
              onClick={methods.handleSubmit(onSubmit)}
              loading={isPending}
            >
              Create
            </LoadingButton>
          </Stack>
        </StyledPaper>
      </StyledPage>
    </DashboardLayout>
  );
}
